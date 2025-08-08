#!/usr/bin/env node

/**
 * Test Script for WebSocket Monitor Restart Functionality
 * Run this script to test different restart scenarios
 */

import {
  WebSocketTestClient,
  ConnectionStressTester,
  RestartTriggerTester,
  createLogMonitor,
} from "./utils/test-utilities.js";

const SERVER_URL = "ws://localhost:3000";

// Test scenarios
const testScenarios = {
  // Test 1: Simple rapid disconnections
  rapidDisconnections: async () => {
    console.log("\n🧪 === TEST 1: Rapid Disconnections ===");
    const tester = new RestartTriggerTester(SERVER_URL);
    await tester.testRapidDisconnections();

    // Wait for potential restart
    await new Promise((resolve) => setTimeout(resolve, 10000));
    tester.cleanup();
  },

  // Test 2: Consecutive failures
  consecutiveFailures: async () => {
    console.log("\n🧪 === TEST 2: Consecutive Failures ===");
    const tester = new RestartTriggerTester(SERVER_URL);
    await tester.testConsecutiveFailures();

    // Wait for potential restart
    await new Promise((resolve) => setTimeout(resolve, 10000));
    tester.cleanup();
  },

  // Test 3: Mixed disconnections
  mixedDisconnections: async () => {
    console.log("\n🧪 === TEST 3: Mixed Disconnections ===");
    const tester = new RestartTriggerTester(SERVER_URL);
    await tester.testMixedDisconnections();

    // Wait for potential restart
    await new Promise((resolve) => setTimeout(resolve, 10000));
    tester.cleanup();
  },

  // Test 4: Stress test
  stressTest: async () => {
    console.log("\n🧪 === TEST 4: Stress Test ===");
    const stressTester = new ConnectionStressTester(SERVER_URL, {
      numClients: 20,
      connectionInterval: 50,
      disconnectInterval: 1000,
      abnormalDisconnectRate: 0.4,
    });

    await stressTester.startStressTest();

    // Wait for potential restart
    await new Promise((resolve) => setTimeout(resolve, 15000));
    stressTester.stopStressTest();
  },

  // Test 5: Manual trigger test
  manualTrigger: async () => {
    console.log("\n🧪 === TEST 5: Manual Trigger Test ===");
    console.log(
      "This test will create exactly 10 abnormal disconnections in 1 minute"
    );
    console.log("Press Ctrl+C to stop this test early");

    const clients = [];

    for (let i = 0; i < 10; i++) {
      const client = new WebSocketTestClient(SERVER_URL);

      try {
        await client.connect();
        clients.push(client);
        console.log(`Connected client ${i + 1}/10`);

        // Force disconnect after 2 seconds
        setTimeout(() => {
          console.log(`Force disconnecting client ${i + 1}`);
          client.forceDisconnect();
        }, 2000);

        // Wait 6 seconds between connections (to stay within 1 minute)
        await new Promise((resolve) => setTimeout(resolve, 6000));
      } catch (error) {
        console.error(`Failed to connect client ${i + 1}:`, error);
      }
    }

    // Wait for restart
    await new Promise((resolve) => setTimeout(resolve, 10000));

    // Cleanup
    clients.forEach((client) => client.disconnect());
  },
};

// Main test runner
async function runTests() {
  console.log("🚀 Starting WebSocket Monitor Restart Tests");
  console.log("Make sure your server is running with: npm run dev:monitored");
  console.log("Server URL:", SERVER_URL);

  // Create log monitor to capture restart events
  const logMonitor = createLogMonitor();

  try {
    // Wait for server to be ready
    console.log("\n⏳ Waiting 3 seconds for server to be ready...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Test each scenario
    for (const [name, testFn] of Object.entries(testScenarios)) {
      try {
        await testFn();

        // Check for restart logs
        const restartLogs = logMonitor.getRestartLogs();
        if (restartLogs.length > 0) {
          console.log(`✅ ${name}: RESTART DETECTED!`);
          restartLogs.forEach((log) => {
            console.log(
              `   ${new Date(log.timestamp).toLocaleTimeString()}: ${
                log.message
              }`
            );
          });
        } else {
          console.log(`❌ ${name}: No restart detected`);
        }

        // Wait between tests
        await new Promise((resolve) => setTimeout(resolve, 5000));
      } catch (error) {
        console.error(`❌ ${name} failed:`, error);
      }
    }
  } catch (error) {
    console.error("Test runner error:", error);
  } finally {
    // Restore console functions
    logMonitor.restore();

    console.log("\n📊 Test Summary:");
    const allLogs = logMonitor.getLogs();
    const restartLogs = logMonitor.getRestartLogs();

    console.log(`Total logs captured: ${allLogs.length}`);
    console.log(`Restart-related logs: ${restartLogs.length}`);

    if (restartLogs.length > 0) {
      console.log("\n🎉 SUCCESS: Restart functionality is working!");
    } else {
      console.log("\n⚠️  No restarts detected. You may need to:");
      console.log("   1. Adjust the restart thresholds in WebSocketMonitor");
      console.log("   2. Increase the number of test connections");
      console.log(
        "   3. Check if the server is running with monitoring enabled"
      );
    }
  }
}

// Handle command line arguments
const args = process.argv.slice(2);
const testName = args[0];

if (testName && testScenarios[testName]) {
  console.log(`🧪 Running specific test: ${testName}`);
  testScenarios[testName]().catch(console.error);
} else if (testName) {
  console.log(`❌ Unknown test: ${testName}`);
  console.log("Available tests:", Object.keys(testScenarios).join(", "));
} else {
  // Run all tests
  runTests();
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Tests interrupted by user");
  process.exit(0);
});

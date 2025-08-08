/**
 * Test Utilities for WebSocket Monitor
 * Provides utilities to simulate connection issues and test restart functionality
 */

import { WebSocket } from "ws";

export class WebSocketTestClient {
  constructor(url, options = {}) {
    this.url = url;
    this.options = options;
    this.ws = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = options.maxReconnectAttempts || 5;
    this.reconnectDelay = options.reconnectDelay || 1000;
  }

  connect() {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url, this.options);

      this.ws.on("open", () => {
        console.log(`🔗 Test client connected to ${this.url}`);
        resolve(this.ws);
      });

      this.ws.on("error", (error) => {
        console.error(`❌ Test client connection error:`, error);
        reject(error);
      });

      this.ws.on("close", (code, reason) => {
        console.log(`🔌 Test client disconnected: ${code} - ${reason}`);
        this.handleReconnect();
      });
    });
  }

  disconnect() {
    if (this.ws) {
      this.ws.close(1000, "Test disconnect");
    }
  }

  forceDisconnect() {
    if (this.ws) {
      this.ws.terminate(); // Force close without proper handshake
    }
  }

  send(message) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(
        `🔄 Test client reconnecting (attempt ${this.reconnectAttempts})...`
      );
      setTimeout(() => {
        this.connect().catch(console.error);
      }, this.reconnectDelay);
    }
  }
}

export class ConnectionStressTester {
  constructor(serverUrl, options = {}) {
    this.serverUrl = serverUrl;
    this.options = {
      numClients: 10,
      connectionInterval: 100, // ms between connections
      disconnectInterval: 2000, // ms before disconnecting
      abnormalDisconnectRate: 0.3, // 30% abnormal disconnects
      ...options,
    };
    this.clients = [];
  }

  async startStressTest() {
    console.log(
      `🧪 Starting stress test with ${this.options.numClients} clients...`
    );

    for (let i = 0; i < this.options.numClients; i++) {
      const client = new WebSocketTestClient(this.serverUrl);

      try {
        await client.connect();
        this.clients.push(client);

        // Randomly disconnect some clients abnormally
        setTimeout(() => {
          if (Math.random() < this.options.abnormalDisconnectRate) {
            console.log(`💥 Force disconnecting client ${i}`);
            client.forceDisconnect();
          } else {
            console.log(`🔌 Normal disconnect for client ${i}`);
            client.disconnect();
          }
        }, this.options.disconnectInterval);

        // Wait before next connection
        await new Promise((resolve) =>
          setTimeout(resolve, this.options.connectionInterval)
        );
      } catch (error) {
        console.error(`Failed to connect client ${i}:`, error);
      }
    }
  }

  stopStressTest() {
    console.log("🛑 Stopping stress test...");
    this.clients.forEach((client) => client.disconnect());
    this.clients = [];
  }
}

export class RestartTriggerTester {
  constructor(serverUrl) {
    this.serverUrl = serverUrl;
    this.clients = [];
  }

  // Test 1: Rapid connections and disconnections
  async testRapidDisconnections() {
    console.log("🧪 Test 1: Rapid disconnections...");

    for (let i = 0; i < 15; i++) {
      const client = new WebSocketTestClient(this.serverUrl);

      try {
        await client.connect();
        this.clients.push(client);

        // Disconnect immediately
        setTimeout(() => {
          client.forceDisconnect();
        }, 100);

        await new Promise((resolve) => setTimeout(resolve, 50));
      } catch (error) {
        console.error(`Failed to connect client ${i}:`, error);
      }
    }
  }

  // Test 2: Consecutive failures
  async testConsecutiveFailures() {
    console.log("🧪 Test 2: Consecutive failures...");

    for (let i = 0; i < 8; i++) {
      const client = new WebSocketTestClient(this.serverUrl);

      try {
        await client.connect();
        this.clients.push(client);

        // Force abnormal disconnect
        setTimeout(() => {
          client.forceDisconnect();
        }, 500);

        await new Promise((resolve) => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`Failed to connect client ${i}:`, error);
      }
    }
  }

  // Test 3: Mixed normal and abnormal disconnections
  async testMixedDisconnections() {
    console.log("🧪 Test 3: Mixed disconnections...");

    for (let i = 0; i < 12; i++) {
      const client = new WebSocketTestClient(this.serverUrl);

      try {
        await client.connect();
        this.clients.push(client);

        setTimeout(() => {
          if (i % 3 === 0) {
            client.forceDisconnect(); // Abnormal
          } else {
            client.disconnect(); // Normal
          }
        }, 300);

        await new Promise((resolve) => setTimeout(resolve, 150));
      } catch (error) {
        console.error(`Failed to connect client ${i}:`, error);
      }
    }
  }

  cleanup() {
    this.clients.forEach((client) => client.disconnect());
    this.clients = [];
  }
}

// Utility function to monitor server logs for restart indicators
export function createLogMonitor() {
  const originalLog = console.log;
  const originalError = console.error;
  const logs = [];

  console.log = (...args) => {
    logs.push({ type: "log", timestamp: Date.now(), message: args.join(" ") });
    originalLog(...args);
  };

  console.error = (...args) => {
    logs.push({
      type: "error",
      timestamp: Date.now(),
      message: args.join(" "),
    });
    originalError(...args);
  };

  return {
    getLogs: () => logs,
    getRestartLogs: () =>
      logs.filter(
        (log) =>
          log.message.includes("🔄") ||
          log.message.includes("restart") ||
          log.message.includes("Requesting server restart")
      ),
    restore: () => {
      console.log = originalLog;
      console.error = originalError;
    },
  };
}

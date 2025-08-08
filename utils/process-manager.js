import { spawn } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Process Manager
 * Manages server lifecycle with automatic restart capabilities
 */
export class ProcessManager {
  constructor(config = {}) {
    this.config = {
      maxRestarts: 10,
      restartDelay: 5000, // 5 seconds
      restartCooldown: 30000, // 30 seconds
      serverPath: join(__dirname, "..", "server.js"),
      ...config,
    };

    this.process = null;
    this.restartCount = 0;
    this.lastRestartTime = 0;
    this.isShuttingDown = false;
  }

  /**
   * Start the process manager
   */
  start() {
    console.log("🚀 Starting Nike WebSocket server with process manager...");
    this.spawnProcess();
    this.setupSignalHandlers();
  }

  /**
   * Spawn the server process
   */
  spawnProcess() {
    const { serverPath } = this.config;

    this.process = spawn("node", [serverPath], {
      stdio: "inherit",
      env: {
        ...process.env,
        NODE_ENV: process.env.NODE_ENV || "development",
        MANAGED_BY_PROCESS_MANAGER: "true",
      },
    });

    this.process.on("error", (error) => {
      console.error("❌ Failed to start server process:", error);
      this.handleProcessExit();
    });

    this.process.on("exit", (code, signal) => {
      console.log(
        `📤 Server process exited with code ${code} and signal ${signal}`
      );

      if (this.isShuttingDown) {
        return; // Don't restart if we're shutting down
      }

      // Check if this was a controlled restart (exit code 1)
      if (code === 1) {
        console.log("🔄 Server requested restart due to connection issues");
        this.handleControlledRestart();
      } else {
        this.handleProcessExit();
      }
    });
  }

  /**
   * Handle controlled restart from server
   */
  handleControlledRestart() {
    const now = Date.now();

    // Check restart cooldown
    if (now - this.lastRestartTime < this.config.restartCooldown) {
      console.log("⏳ Restart cooldown active, waiting...");
      setTimeout(() => {
        this.restart();
      }, this.config.restartCooldown - (now - this.lastRestartTime));
      return;
    }

    this.restart();
  }

  /**
   * Handle unexpected process exit
   */
  handleProcessExit() {
    this.restartCount++;

    if (this.restartCount >= this.config.maxRestarts) {
      console.error(
        `❌ Maximum restart attempts (${this.config.maxRestarts}) reached. Stopping process manager.`
      );
      process.exit(1);
    }

    console.log(
      `🔄 Restarting server (attempt ${this.restartCount}/${this.config.maxRestarts})...`
    );
    setTimeout(() => {
      this.spawnProcess();
    }, this.config.restartDelay);
  }

  /**
   * Restart the server
   */
  restart() {
    this.restartCount++;
    this.lastRestartTime = Date.now();

    if (this.restartCount >= this.config.maxRestarts) {
      console.error(
        `❌ Maximum restart attempts (${this.config.maxRestarts}) reached. Stopping process manager.`
      );
      this.shutdown();
      return;
    }

    console.log(
      `🔄 Restarting server (attempt ${this.restartCount}/${this.config.maxRestarts})...`
    );

    if (this.process) {
      this.process.kill("SIGTERM");
    }

    setTimeout(() => {
      this.spawnProcess();
    }, this.config.restartDelay);
  }

  /**
   * Setup signal handlers for graceful shutdown
   */
  setupSignalHandlers() {
    const shutdown = () => {
      console.log(
        "🛑 Process manager received shutdown signal, shutting down..."
      );
      this.shutdown();
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  }

  /**
   * Graceful shutdown
   */
  shutdown() {
    this.isShuttingDown = true;
    console.log("🛑 Shutting down process manager...");

    if (this.process) {
      this.process.kill("SIGTERM");
    }

    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }

  /**
   * Get process manager statistics
   */
  getStats() {
    return {
      restartCount: this.restartCount,
      maxRestarts: this.config.maxRestarts,
      isShuttingDown: this.isShuttingDown,
      hasProcess: !!this.process,
    };
  }
}

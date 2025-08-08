/**
 * WebSocket Connection Monitor
 * Monitors WebSocket connection health and provides restart recommendations
 */

export class WebSocketMonitor {
  constructor(config = {}) {
    this.config = {
      maxDisconnectionsPerMinute: 10,
      maxConsecutiveFailures: 5,
      healthCheckInterval: 30000, // 30 seconds
      restartCooldown: 60000, // 1 minute
      ...config,
    };

    this.stats = {
      totalConnections: 0,
      totalDisconnections: 0,
      consecutiveFailures: 0,
      disconnectionsInLastMinute: 0,
      lastRestartTime: 0,
      healthCheckTimer: null,
    };

    this.clients = new Set();
    this.onRestartRequested = null;
  }

  /**
   * Initialize the monitor with restart callback
   */
  init(onRestartRequested) {
    this.onRestartRequested = onRestartRequested;
    this.startHealthMonitoring();
    return this;
  }

  /**
   * Register a new WebSocket connection
   */
  registerConnection(ws) {
    this.clients.add(ws);
    this.stats.totalConnections++;
    this.stats.consecutiveFailures = 0; // Reset on successful connection

    console.log(
      `✅ WebSocket connected (${this.getActiveConnections()} active)`
    );
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnection(ws, code, reason) {
    this.clients.delete(ws);
    this.stats.totalDisconnections++;
    this.stats.disconnectionsInLastMinute++;

    const isAbnormal = code !== 1000 && code !== 1001; // Not normal closure or going away

    if (isAbnormal) {
      this.stats.consecutiveFailures++;
      console.log(
        `⚠️  Abnormal disconnection (code: ${code}, reason: ${reason})`
      );
    }

    console.log(
      `❌ WebSocket disconnected (${this.getActiveConnections()} active)`
    );

    this.checkRestartConditions();
  }

  /**
   * Handle WebSocket error
   */
  handleError(ws, error) {
    this.clients.delete(ws);
    this.stats.totalDisconnections++;
    this.stats.disconnectionsInLastMinute++;
    this.stats.consecutiveFailures++;

    console.error(`❌ WebSocket error:`, error);
    this.checkRestartConditions();
  }

  /**
   * Get number of active connections
   */
  getActiveConnections() {
    return Array.from(this.clients).filter((client) => client.readyState === 1)
      .length;
  }

  /**
   * Get all active clients
   */
  getClients() {
    return this.clients;
  }

  /**
   * Broadcast message to all clients with error handling
   */
  broadcast(message) {
    const messageStr = JSON.stringify(message);
    let sentCount = 0;
    let errorCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        try {
          client.send(messageStr);
          sentCount++;
        } catch (error) {
          console.error("Error sending message to client:", error);
          this.clients.delete(client);
          this.stats.totalDisconnections++;
          this.stats.disconnectionsInLastMinute++;
          errorCount++;
        }
      }
    });

    console.log(
      `📤 Broadcast: ${sentCount} sent, ${errorCount} failed, ${this.getActiveConnections()} active`
    );

    if (errorCount > 0) {
      this.checkRestartConditions();
    }
  }

  /**
   * Check if restart conditions are met
   */
  checkRestartConditions() {
    if (this.shouldRestart()) {
      this.requestRestart();
    }
  }

  /**
   * Determine if server should restart
   */
  shouldRestart() {
    const now = Date.now();

    // Don't restart if we just restarted recently
    if (now - this.stats.lastRestartTime < this.config.restartCooldown) {
      return false;
    }

    // Check for too many disconnections in the last minute
    if (
      this.stats.disconnectionsInLastMinute >=
      this.config.maxDisconnectionsPerMinute
    ) {
      console.log(
        `⚠️  High disconnection rate: ${this.stats.disconnectionsInLastMinute} in the last minute`
      );
      return true;
    }

    // Check for consecutive connection failures
    if (this.stats.consecutiveFailures >= this.config.maxConsecutiveFailures) {
      console.log(
        `⚠️  Too many consecutive failures: ${this.stats.consecutiveFailures}`
      );
      return true;
    }

    return false;
  }

  /**
   * Request server restart
   */
  requestRestart() {
    console.log("🔄 Requesting server restart due to connection issues...");
    this.stats.lastRestartTime = Date.now();

    if (this.onRestartRequested) {
      this.onRestartRequested();
    }
  }

  /**
   * Start health monitoring
   */
  startHealthMonitoring() {
    // Reset disconnection counter every minute
    setInterval(() => {
      this.stats.disconnectionsInLastMinute = 0;
    }, 60000);

    // Health check interval
    this.stats.healthCheckTimer = setInterval(() => {
      const activeConnections = this.getActiveConnections();
      console.log(
        `📊 Health Check - Active: ${activeConnections}, Total: ${this.stats.totalConnections}, Disconnections: ${this.stats.totalDisconnections}`
      );

      this.checkRestartConditions();
    }, this.config.healthCheckInterval);
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    if (this.stats.healthCheckTimer) {
      clearInterval(this.stats.healthCheckTimer);
    }

    this.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.close(1012, "Monitor cleanup");
      }
    });
    this.clients.clear();
  }

  /**
   * Get monitoring statistics
   */
  getStats() {
    return {
      ...this.stats,
      activeConnections: this.getActiveConnections(),
      totalClients: this.clients.size,
    };
  }
}

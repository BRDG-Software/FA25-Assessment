import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";
import { WebSocketMonitor } from "./utils/websocket-monitor.js";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Initialize WebSocket monitor
const wsMonitor = new WebSocketMonitor({
  maxDisconnectionsPerMinute: 10,
  maxConsecutiveFailures: 5,
  healthCheckInterval: 30000, // 30 seconds
  restartCooldown: 60000, // 1 minute
});

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  });

  // Create WebSocket server
  const wss = new WebSocketServer({ server });

  // Initialize monitor with restart callback
  wsMonitor.init(() => {
    console.log("🔄 Server requesting restart...");
    // Cleanup and exit with code 1 to signal controlled restart
    wsMonitor.cleanup();
    process.exit(1);
  });

  wss.on("connection", (ws, req) => {
    // Register connection with monitor
    wsMonitor.registerConnection(ws);

    // Send welcome message
    ws.send(
      JSON.stringify({
        event: "connected",
        message: "WebSocket connection established",
      })
    );

    // Handle incoming messages from clients (hardware controllers or frontend)
    ws.on("message", (data) => {
      try {
        const message = JSON.parse(data.toString());
        console.log("Received WebSocket message:", message);

        // Broadcast the message to all connected clients
        wsMonitor.broadcast(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    ws.on("close", (code, reason) => {
      wsMonitor.handleDisconnection(ws, code, reason);
    });

    ws.on("error", (error) => {
      wsMonitor.handleError(ws, error);
    });
  });

  // Make broadcast function available globally for API routes
  global.broadcastToAllClients = (message) => wsMonitor.broadcast(message);

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server running on ws://${hostname}:${port}`);
    console.log(`> Connection monitoring enabled with auto-restart`);
  });
});

// Graceful shutdown handling
const gracefulShutdown = () => {
  console.log("🛑 Received shutdown signal, shutting down gracefully...");
  wsMonitor.cleanup();
  process.exit(0);
};

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

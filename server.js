import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { WebSocketServer } from "ws";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = process.env.PORT || 3000;

// Prepare the Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

// Store connected WebSocket clients
const clients = new Set();

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

  wss.on("connection", (ws, req) => {
    console.log("New WebSocket client connected");
    clients.add(ws);

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
        broadcastToAllClients(message);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket client disconnected");
      clients.delete(ws);
    });

    ws.on("error", (error) => {
      console.error("WebSocket error:", error);
      clients.delete(ws);
    });
  });

  // Function to broadcast messages to all connected clients
  function broadcastToAllClients(message) {
    const messageStr = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(messageStr);
      }
    });
    console.log(`Broadcasting to ${clients.size} clients:`, message);
  }

  // Make broadcast function available globally for API routes
  global.broadcastToAllClients = broadcastToAllClients;

  server.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
    console.log(`> WebSocket server running on ws://${hostname}:${port}`);
  });
});

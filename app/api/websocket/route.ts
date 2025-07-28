import { NextRequest } from "next/server";

// Extend global type to include broadcastToAllClients
declare global {
  var broadcastToAllClients:
    | ((message: { event: string; value?: unknown }) => void)
    | undefined;
}

// API route for hardware controller to send events (fallback method)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, value } = body as { event: string; value: unknown };

    if (!event) {
      return new Response(JSON.stringify({ error: "Event is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Use the global broadcast function from the custom server
    if (typeof global.broadcastToAllClients === "function") {
      global.broadcastToAllClients({ event, value });
      console.log(`Broadcasting event: ${event} with value:`, value);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Event ${event} broadcasted successfully`,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      console.error("WebSocket server not available");
      return new Response(
        JSON.stringify({ error: "WebSocket server not available" }),
        {
          status: 503,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  } catch (error) {
    console.error("Error processing hardware event:", error);
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }
}

import { Server as HTTPServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

type OrderEvent = {
  type: "new_order" | "order_updated" | "order_deleted";
  data: any;
};

class OrderNotificationManager {
  private wss: WebSocketServer;
  private clients: Set<WebSocket> = new Set();

  constructor(server: HTTPServer) {
    this.wss = new WebSocketServer({ server, path: "/ws/orders" });
    this.setupWebSocket();
  }

  private setupWebSocket() {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("[WebSocket] New client connected");
      this.clients.add(ws);

      ws.on("close", () => {
        console.log("[WebSocket] Client disconnected");
        this.clients.delete(ws);
      });

      ws.on("error", (error: Error) => {
        console.error("[WebSocket] Error:", error);
        this.clients.delete(ws);
      });
    });
  }

  broadcast(event: OrderEvent) {
    const message = JSON.stringify(event);
    let successCount = 0;

    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message, (error?: Error) => {
          if (error) {
            console.error("[WebSocket] Send error:", error);
          } else {
            successCount++;
          }
        });
      }
    });

    console.log(
      `[WebSocket] Broadcast sent to ${successCount}/${this.clients.size} clients`
    );
  }

  notifyNewOrder(order: any) {
    this.broadcast({
      type: "new_order",
      data: order,
    });
  }

  notifyOrderUpdated(orderId: number, status: string) {
    this.broadcast({
      type: "order_updated",
      data: { orderId, status },
    });
  }

  notifyOrderDeleted(orderId: number) {
    this.broadcast({
      type: "order_deleted",
      data: { orderId },
    });
  }

  getClientCount() {
    return this.clients.size;
  }
}

let notificationManager: OrderNotificationManager | null = null;

export function initializeWebSocket(server: HTTPServer) {
  notificationManager = new OrderNotificationManager(server);
  console.log("[WebSocket] Initialized");
  return notificationManager;
}

export function getNotificationManager() {
  if (!notificationManager) {
    throw new Error("WebSocket not initialized");
  }
  return notificationManager;
}

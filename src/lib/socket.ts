import { io, Socket } from "socket.io-client";

// The single source of truth for the socket configuration
// NEXT_PUBLIC_SOCKET_URL should be set in .env files (e.g., http://localhost:5000 for local, production URL for live)
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://norinlylive-production.up.railway.app";

/**
 * Singleton socket instance configured for production deployment.
 * Uses hybrid transport (polling -> websocket) for maximum reliability across environments.
 */
export const socket: Socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"],
  upgrade: true,
  secure: true,
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  withCredentials: true,
});

// Production Debugging and Monitoring
if (typeof window !== "undefined") {
  socket.on("connect", () => {
    console.log("✅ Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.warn("%c[Socket] Disconnected:", "color: #f59e0b; font-weight: bold;", reason);
  });
}

export default socket;

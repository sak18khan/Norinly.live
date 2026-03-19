import { io, Socket } from "socket.io-client";

// The single source of truth for the socket configuration
// NEXT_PUBLIC_SOCKET_URL should be https://norinlylive-production.up.railway.app in production
const SOCKET_URL = "https://norinlylive-production.up.railway.app";

/**
 * Singleton socket instance configured for production deployment.
 * Forced to use 'websocket' ONLY to bypass CORS/polling issues.
 */
export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
  upgrade: false,
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

import { io, Socket } from "socket.io-client";

// The single source of truth for the socket configuration
// NEXT_PUBLIC_SOCKET_URL should be set in .env files (e.g., http://localhost:5000 for local, production URL for live)
const getSocketUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  
  // If the env variable is set and is valid (not a placeholder or the deprecated railway URL)
  if (envUrl && envUrl !== "PLACEHOLDER_SOCKET_URL" && !envUrl.includes("railway.app")) {
    return envUrl;
  }
  
  // In the browser, default to connecting to the same origin (handled by Nginx reverse proxy)
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  
  // Fallback for SSR/Server side
  return "http://localhost:5000";
};

const SOCKET_URL = getSocketUrl();

/**
 * Singleton socket instance configured for production deployment.
 * Uses hybrid transport (polling -> websocket) for maximum reliability across environments.
 */
export const socket: Socket = io(SOCKET_URL, {
  transports: ["websocket"],
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

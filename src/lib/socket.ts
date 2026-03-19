import { io, Socket } from "socket.io-client";

// The single source of truth for the socket configuration
// NEXT_PUBLIC_SOCKET_URL should be https://norinlylive-production.up.railway.app in production
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "https://norinlylive-production.up.railway.app";

/**
 * Singleton socket instance configured for production deployment.
 * Forced to use 'websocket' transport to avoid common issues with Vercel and Railway.
 */
export const socket: Socket = io(SOCKET_URL, {
  transports: ["polling", "websocket"], // Allow polling fallback for debugging on Railway
  secure: true,
  autoConnect: false, // Components should manually call .connect() to control lifecycle
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  withCredentials: false,
});

// Production Debugging and Monitoring
if (typeof window !== "undefined") {
  socket.on("connect", () => {
    console.log("%c[Socket] Connected successfully:", "color: #10b981; font-weight: bold;", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("%c[Socket] Connection error:", "color: #ef4444; font-weight: bold;", err.message);
    
    // In case of error, we can log the URL being attempted (useful for debugging misconfigured env vars)
    console.debug("[Socket] Attempting URL:", SOCKET_URL);
  });

  socket.on("disconnect", (reason) => {
    console.warn("%c[Socket] Disconnected:", "color: #f59e0b; font-weight: bold;", reason);
  });
}

export default socket;

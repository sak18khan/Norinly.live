import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes';
import { setupSocketHandlers } from './sockets/socketHandler';

dotenv.config();

console.log("🚀 Starting Norinly backend server...");

const app = express();
const server = http.createServer(app);

// Basic middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Norinly Server is running');
});

// Socket.io initialization with forced WebSocket and permissive CORS
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for testing
    methods: ["GET", "POST"]
  },
  transports: ["websocket"],
});

// Diagnostic logging for connections
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  
  socket.on('disconnect', () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// CRITICAL: Handle WebSocket upgrade requests
server.on("upgrade", (req, socket, head) => {
  console.log("🔥 Upgrade request received:", req.url);
});

// Crash protection
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { app, io };

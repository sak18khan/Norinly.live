import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import healthRoutes from './routes/healthRoutes';
import { setupSocketHandlers } from './sockets/socketHandler';
import { rateLimiter } from './middleware/rateLimiter';

dotenv.config();

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: [
    "https://norinly.live",
    "http://localhost:3000"
  ],
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(rateLimiter); // Temporarily disabled to rule out socket connection interference

// Routes
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const io = new Server(server, {
  cors: {
    origin: [
      "https://norinly.live",
      "http://localhost:3000"
    ],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ["websocket"],
});

// Diagnostic logging for connections
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);
  
  socket.on('disconnect', (reason) => {
    console.log(`[Socket] Disconnected: ${socket.id} | Reason: ${reason}`);
  });
});

// CRITICAL: Handle WebSocket upgrade requests
server.on("upgrade", (req, socket, head) => {
  console.log("🔄 Upgrade request received:", req.url);
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { app, io };

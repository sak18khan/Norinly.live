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

// CORS configuration
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;
const corsOptions = {
  origin: "*", // Allow all origins for production testing as requested
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket'], // Force websocket as requested for production reliability
  allowEIO3: true,
  pingInterval: 25000,
  pingTimeout: 5000
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] Norinly backend running on port ${PORT}`);
});

export { app, io };

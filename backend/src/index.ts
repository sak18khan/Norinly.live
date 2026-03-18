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
  origin: [
    "https://norinly.live",
    "https://Norinly.live",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    ...(ALLOWED_ORIGIN ? [ALLOWED_ORIGIN] : [])
  ],
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(rateLimiter);

// Routes
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Norinly Backend API is running');
});

// Socket.io setup
const io = new Server(server, {
  cors: corsOptions,
  transports: ['websocket', 'polling'],
  pingInterval: 10000,
  pingTimeout: 5000
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`[Server] Norinly backend running on port ${PORT}`);
});

export { app, io };

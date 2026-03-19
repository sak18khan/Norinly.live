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
  origin: true, // Echoes back the request origin - required for credentials: true
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
  cors: {
    origin: (origin, callback) => {
      // Allow all origins in production for testing
      callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['polling', 'websocket'],
  pingInterval: 25000,
  pingTimeout: 20000 // Very relaxed timeout for debugging
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Server] Norinly backend running on port ${PORT}`);
});

export { app, io };

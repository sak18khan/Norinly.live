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
  origin: "*", // Use wildcard since we are disabling credentials
  methods: ["GET", "POST"],
  credentials: false
};

app.use(express.json());
// app.use(rateLimiter); // Temporarily disabled to rule out socket connection interference

// Routes
app.use('/health', healthRoutes);

app.get('/', (req, res) => {
  res.send('Server is running');
});

const io = new Server(server, {
  path: "/socket.io", // Explicitly match frontend path without trailing slash
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: false
  },
  transports: ['websocket'], // Force websocket on backend too
  pingInterval: 25000,
  pingTimeout: 30000 
});

setupSocketHandlers(io);

const PORT = process.env.PORT || 5000;

server.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`[Server] Norinly backend running on port ${PORT}`);
});

export { app, io };

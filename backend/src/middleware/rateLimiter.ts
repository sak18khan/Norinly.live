import { Request, Response, NextFunction } from 'express';

const ipCounts = new Map<string, { count: number; lastReset: number }>();
const LIMIT = 100; // requests
const WINDOW = 60 * 1000; // 1 minute

export const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = ipCounts.get(ip);

  if (!entry || (now - entry.lastReset) > WINDOW) {
    ipCounts.set(ip, { count: 1, lastReset: now });
    return next();
  }

  entry.count++;
  if (entry.count > LIMIT) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  next();
};

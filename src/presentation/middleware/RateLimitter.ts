import { Request, Response, NextFunction } from 'express';

const requestCounts: Record<string, { count: number; timer: NodeJS.Timeout }> = {};
const WINDOW_SIZE = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100; // Max requests per window

export const rateLimiter = (req: Request, res: Response, next: NextFunction): any => {
  const ip = req.ip;

  if (!ip) {
    return res.status(400).json({ error: 'IP address not found.' });
  }

  if (!requestCounts[ip]) {
    requestCounts[ip] = {
      count: 1,
      timer: setTimeout(() => {
        delete requestCounts[ip];
      }, WINDOW_SIZE),
    };
    return next();
  }

  requestCounts[ip].count++;

  if (requestCounts[ip].count > MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Too many requests, please try again later.',
    });
  }

  next();
};

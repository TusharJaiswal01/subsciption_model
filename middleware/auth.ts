import type { NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (
  req: any,
  res: any,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ error: "Access token required" });
    return;
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "fallback_secret";
    const decoded = jwt.verify(token, jwtSecret) as {
      id: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};


export const generateToken = (userId: string, email: string): string => {
  const jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt.sign({ id: userId, email }, jwtSecret, { expiresIn: '24h' });
};

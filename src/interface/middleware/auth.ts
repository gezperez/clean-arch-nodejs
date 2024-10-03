import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../../domain/entities/User';

const JWT_SECRET = process.env.JWT_SECRET;

export const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};

const extractTokenFromHeader = (req: Request): string | undefined => {
  return req.header('Authorization')?.split(' ')[1];
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = extractTokenFromHeader(req);

  if (!token) {
    res.status(403).json({
      errorCode: 403,
      message: 'Unauthorized',
    });
    return;
  }

  try {
    const user = verifyToken(token);
    req['user'] = user as User;
    next();
  } catch {
    res.sendStatus(403);
  }
};

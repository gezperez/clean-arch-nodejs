import { Request, Response, NextFunction } from 'express';
import { JWTRepository } from '../../infrastructure/repositories/JWTRepository';

const jwtRepository = new JWTRepository();

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
    const user = jwtRepository.verifyAccessToken(token);

    req['user'] = user;
    next();
  } catch {
    res.status(403).json({
      errorCode: 403,
      message: 'Unauthorized',
    });
  }
};

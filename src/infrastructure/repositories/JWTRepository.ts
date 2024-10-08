import jwt from 'jsonwebtoken';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { User } from '../../domain/entities/User';
import { JWTPayload } from '../../domain/entities/JWT';

export class JWTRepository implements IAuthRepository {
  verifyAccessToken(token: string): string | JWTPayload {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  }
  verifyRefreshToken(token: string): string | JWTPayload {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  }
  generateAccessToken(user: User): string {
    return jwt.sign(user, process.env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
  }
  generateRefreshToken(user: User): string {
    return jwt.sign({ email: user.email }, process.env.JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
  }
}

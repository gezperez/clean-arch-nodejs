import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../../../domain/entities/User';
import { IAuthRepository } from '../../../domain/interfaces/IAuthRepository';
import * as argon2 from 'argon2';

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

export class JWTRepository implements IAuthRepository {
  refreshAccessToken(token: string): string | JwtPayload {
    return jwt.verify(token, JWT_REFRESH_SECRET);
  }
  generateAccessToken(user: User): string {
    return jwt.sign(user, JWT_ACCESS_SECRET, { expiresIn: '15m' });
  }
  generateRefreshToken(user: User): string {
    return jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });
  }
  hashPassword(password: string): Promise<string> {
    return argon2.hash(password);
  }
}

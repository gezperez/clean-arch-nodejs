import { JWTPayload } from '../entities/JWT';
import { User } from '../entities/User';

export interface IAuthRepository {
  verifyAccessToken(token: string): string | JWTPayload;
  verifyRefreshToken(token: string): string | JWTPayload;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
}

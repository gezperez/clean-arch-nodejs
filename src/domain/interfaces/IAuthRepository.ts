import { JWTPayload } from '../entities/JWT';
import { User } from '../entities/User';

export interface IAuthRepository {
  refreshAccessToken(token: string): string | JWTPayload;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
  hashPassword(password: string): Promise<string>;
}

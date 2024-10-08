import { AuthResponse } from '../domain/entities/Auth';
import { JWTPayload, RefreshAccessTokenResponse } from '../domain/entities/JWT';
import { User } from '../domain/entities/User';
import { IAuthRepository } from '../domain/interfaces/IAuthRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class AuthUseCases {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository,
  ) {}

  async login(user: User): Promise<AuthResponse> {
    const accessToken = this.authRepository.generateAccessToken(user);
    const refreshToken = this.authRepository.generateRefreshToken(user);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(token: string): Promise<RefreshAccessTokenResponse> {
    const payload = this.authRepository.verifyRefreshToken(token) as JWTPayload;

    const user = await this.userRepository.findByEmail(payload.email);

    const newAccessToken = this.authRepository.generateAccessToken(user);
    const newRefreshToken = this.authRepository.generateRefreshToken(user);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}

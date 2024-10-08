import { AuthResponse } from '../domain/entities/Auth';
import { JWTPayload, RefreshAccessTokenResponse } from '../domain/entities/JWT';
import { User } from '../domain/entities/User';
import { IAuthRepository } from '../domain/interfaces/IAuthRepository';
import { IHashRepository } from '../domain/interfaces/IHashRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { HttpError } from '../interface/middleware/error';

export class AuthUseCases {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
  ) {}

  async login(user: User): Promise<AuthResponse> {
    const foundUser = await this.userRepository.findByEmail(user.email);

    if (!foundUser) {
      throw new HttpError(404, 'Category not found');
    }

    const isPasswordValid = await this.hashRepository.verifyPassword(
      foundUser.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new HttpError(401, 'Invalid credentials');
    }

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

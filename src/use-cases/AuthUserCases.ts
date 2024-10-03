import { AuthResponse } from '../domain/entities/Auth';
import { User } from '../domain/entities/User';
import { IAuthRepository } from '../domain/interfaces/IAuthRepository';

export class AuthUseCases {
  constructor(private authRepository: IAuthRepository) {}

  async login(user: User): Promise<AuthResponse> {
    const accessToken = this.authRepository.generateAccessToken(user);
    const refreshToken = this.authRepository.generateRefreshToken(user);

    return {
      ...user,
      accessToken,
      refreshToken,
    };
  }
}

import { AuthUseCases } from '../AuthUseCases';
import { User } from '../../domain/entities/User';
import { IAuthRepository } from '../../domain/interfaces/IAuthRepository';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IHashRepository } from '../../domain/interfaces/IHashRepository';

describe('AuthUseCases', () => {
  const mockAuthRepository = {
    generateAccessToken: jest.fn(),
    generateRefreshToken: jest.fn(),
    verifyRefreshToken: jest.fn(),
    verifyAccessToken: jest.fn(),
  } as unknown as jest.Mocked<IAuthRepository>;

  const mockUserRepository = {
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    addCurrency: jest.fn(),
    deleteCurrency: jest.fn(),
  } as unknown as jest.Mocked<IUserRepository>;

  const mockHashRepository = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
  } as unknown as jest.Mocked<IHashRepository>;

  let authUseCases: AuthUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    authUseCases = new AuthUseCases(
      mockAuthRepository,
      mockUserRepository,
      mockHashRepository,
    );
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData: User = {
        id: '',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      const foundUser: User = {
        id: '1',
        email: loginData.email,
        password: 'hashedPassword',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      const accessToken = 'access-token';
      const refreshToken = 'refresh-token';

      mockUserRepository.findByEmail.mockResolvedValue(foundUser);
      mockHashRepository.verifyPassword.mockResolvedValue(true);
      mockAuthRepository.generateAccessToken.mockReturnValue(accessToken);
      mockAuthRepository.generateRefreshToken.mockReturnValue(refreshToken);

      const result = await authUseCases.login(loginData);

      expect(result).toEqual({
        ...foundUser,
        accessToken,
        refreshToken,
      });
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        loginData.email,
      );
      expect(mockHashRepository.verifyPassword).toHaveBeenCalledWith(
        foundUser.password,
        loginData.password,
      );
      expect(mockAuthRepository.generateAccessToken).toHaveBeenCalledWith(
        foundUser,
      );
      expect(mockAuthRepository.generateRefreshToken).toHaveBeenCalledWith(
        foundUser,
      );
    });

    it('should throw error when user not found', async () => {
      const loginData: User = {
        id: '',
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(authUseCases.login(loginData)).rejects.toThrow(
        'User not found',
      );
    });

    it('should throw error when password is incorrect', async () => {
      const loginData: User = {
        id: '',
        email: 'test@example.com',
        password: 'wrongpassword',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      const foundUser: User = {
        id: '1',
        email: loginData.email,
        password: 'hashedPassword',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      mockUserRepository.findByEmail.mockResolvedValue(foundUser);
      mockHashRepository.verifyPassword.mockResolvedValue(false);

      await expect(authUseCases.login(loginData)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh tokens successfully', async () => {
      const refreshToken = 'old-refresh-token';
      const user: User = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        theme: 'light',
        currencies: ['USD'],
      };

      const payload = {
        id: user.id,
        email: user.email,
      };

      const newAccessToken = 'new-access-token';
      const newRefreshToken = 'new-refresh-token';

      mockAuthRepository.verifyRefreshToken.mockReturnValue(payload);
      mockUserRepository.findByEmail.mockResolvedValue(user);
      mockAuthRepository.generateAccessToken.mockReturnValue(newAccessToken);
      mockAuthRepository.generateRefreshToken.mockReturnValue(newRefreshToken);

      const result = await authUseCases.refreshAccessToken(refreshToken);

      expect(result).toEqual({
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
      expect(mockAuthRepository.verifyRefreshToken).toHaveBeenCalledWith(
        refreshToken,
      );
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        payload.email,
      );
      expect(mockAuthRepository.generateAccessToken).toHaveBeenCalledWith(user);
      expect(mockAuthRepository.generateRefreshToken).toHaveBeenCalledWith(
        user,
      );
    });
  });
});

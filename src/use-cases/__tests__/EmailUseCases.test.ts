import { EmailUseCases } from '../EmailUseCases';
import { UserUseCases } from '../UserUseCases';
import { User } from '../../domain/entities/User';
import { HttpError } from '../../interface/middleware/error';

jest.mock('../UserUseCases');

describe('EmailUseCases', () => {
  const mockUserUseCases = {
    findByEmail: jest.fn(),
  } as unknown as jest.Mocked<UserUseCases>;

  let emailUseCases: EmailUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    emailUseCases = new EmailUseCases(mockUserUseCases);
  });

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashedPassword',
    name: 'Test User',
    theme: 'light',
    currency: 'USD',
    conversionCurrency: 'EUR',
  };

  describe('validateEmail', () => {
    it('should return true when email exists', async () => {
      mockUserUseCases.findByEmail.mockResolvedValue(mockUser);

      const result = await emailUseCases.validateEmail('test@example.com');

      expect(result).toBe(true);
      expect(mockUserUseCases.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw error when email does not exist', async () => {
      mockUserUseCases.findByEmail.mockRejectedValue(
        new HttpError(404, 'User not found'),
      );

      await expect(
        emailUseCases.validateEmail('nonexistent@example.com'),
      ).rejects.toThrow('User not found');
      expect(mockUserUseCases.findByEmail).toHaveBeenCalledWith(
        'nonexistent@example.com',
      );
    });
  });
});

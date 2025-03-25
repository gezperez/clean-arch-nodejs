import { UserUseCases } from '../UserUseCases';
import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { IHashRepository } from '../../domain/interfaces/IHashRepository';

describe('UserUseCases', () => {
  const mockUserRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByEmail: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    addCurrency: jest.fn(),
    deleteCurrency: jest.fn(),
  } as unknown as jest.Mocked<IUserRepository>;

  const mockHashRepository = {
    hashPassword: jest.fn(),
    verifyPassword: jest.fn(),
  } as unknown as jest.Mocked<IHashRepository>;

  let userUseCases: UserUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    userUseCases = new UserUseCases(mockUserRepository, mockHashRepository);
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

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [mockUser];
      mockUserRepository.findAll.mockResolvedValue(users);

      const result = await userUseCases.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userUseCases.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userUseCases.findById('1')).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      const result = await userUseCases.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        userUseCases.findByEmail('test@example.com'),
      ).rejects.toThrow('User not found');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser: User = {
        id: '',
        email: 'new@example.com',
        password: 'password123',
        name: 'New User',
        theme: 'light',
        currency: 'USD',
        conversionCurrency: 'EUR',
      };

      const hashedPassword = 'hashedPassword123';
      const createdUser = { ...newUser, id: '2', password: hashedPassword };

      mockUserRepository.findByEmail.mockResolvedValue(null);
      mockHashRepository.hashPassword.mockResolvedValue(hashedPassword);
      mockUserRepository.create.mockResolvedValue(createdUser);

      const result = await userUseCases.create(newUser);

      expect(result).toEqual(createdUser);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        newUser.email,
      );
      expect(mockHashRepository.hashPassword).toHaveBeenCalledWith(
        newUser.password,
      );
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...newUser,
        password: hashedPassword,
      });
    });

    it('should throw error when user already exists', async () => {
      const newUser: User = {
        id: '',
        email: 'existing@example.com',
        password: 'password123',
        name: 'New User',
        theme: 'light',
        currency: 'USD',
        conversionCurrency: 'EUR',
      };

      mockUserRepository.findByEmail.mockResolvedValue(mockUser);

      await expect(userUseCases.create(newUser)).rejects.toThrow(
        'User already exists',
      );
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updateData: User = {
        ...mockUser,
        name: 'Updated Name',
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(updateData);

      const result = await userUseCases.update('1', updateData);

      expect(result).toEqual(updateData);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', updateData);
    });

    it('should throw error when user not found', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userUseCases.update('1', mockUser)).rejects.toThrow(
        'User not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockUserRepository.delete.mockResolvedValue(mockUser);

      const result = await userUseCases.delete('1');

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});

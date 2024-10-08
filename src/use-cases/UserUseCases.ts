import { User } from '../domain/entities/User';
import { IHashRepository } from '../domain/interfaces/IHashRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';
import { HttpError } from '../interface/middleware/error';

export class UserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new HttpError(404, 'User not found');
    }

    return foundUser;
  }

  async findByEmail(email: string): Promise<User | null> {
    const foundUser = this.userRepository.findByEmail(email);

    if (!foundUser) {
      throw new HttpError(404, 'User not found');
    }

    return foundUser;
  }

  async create(user: User): Promise<User> {
    const userExists = await this.userRepository.findByEmail(user.email);

    if (userExists) {
      throw new HttpError(409, 'User already exists');
    }

    const newUser: User = {
      ...user,
      password: await this.hashRepository.hashPassword(user.password),
    };

    return this.userRepository.create(newUser);
  }

  async update(id: string, user: User): Promise<User | null> {
    const foundUser = await this.userRepository.findById(id);

    if (!foundUser) {
      throw new HttpError(404, 'User not found');
    }

    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}

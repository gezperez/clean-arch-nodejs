import { User } from '../domain/entities/User';
import { IHashRepository } from '../domain/interfaces/IHashRepository';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class UserUseCases {
  constructor(
    private userRepository: IUserRepository,
    private hashRepository: IHashRepository,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async create(user: User): Promise<User> {
    const newUser: User = {
      ...user,
      password: await this.hashRepository.hashPassword(user.password),
    };

    return this.userRepository.create(newUser);
  }

  async update(id: string, user: User): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}

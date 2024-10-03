import { User } from '../domain/entities/User';
import { IUserRepository } from '../domain/interfaces/IUserRepository';

export class UserUseCases {
  constructor(private userRepository: IUserRepository) {}

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
    return this.userRepository.create(user);
  }

  async update(id: string, user: User): Promise<User | null> {
    return this.userRepository.update(id, user);
  }

  async delete(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}

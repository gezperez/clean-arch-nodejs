import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import prisma from '../models/PrismaClient';

export class PrismaUserRepository implements IUserRepository {
  findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  create(user: User): Promise<User> {
    return prisma.user.create({
      data: user,
    });
  }

  update(id: string, user: User): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: user,
    });
  }
  delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }
}

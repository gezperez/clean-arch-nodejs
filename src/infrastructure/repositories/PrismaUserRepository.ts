import { User } from '../../domain/entities/User';
import { IUserRepository } from '../../domain/interfaces/IUserRepository';
import { prisma } from '../database/Prisma';
import { v4 as uuidv4 } from 'uuid';

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
      data: {
        ...user,
        id: uuidv4(),
        updatedAt: new Date(),
      },
    });
  }

  update(id: string, user: User): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data: {
        ...user,
        updatedAt: new Date(),
      },
    });
  }

  delete(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  }

  addCurrency(userId: string, currency: string): Promise<User> {
    return prisma.user.update({
      where: { id: userId },
      data: { currencies: { push: currency } },
    });
  }

  async deleteCurrency(userId: string, currency: string): Promise<User> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currencies: true },
    });

    const updatedCurrencies = user.currencies.filter((c) => c !== currency);

    return prisma.user.update({
      where: { id: userId },
      data: { currencies: updatedCurrencies },
    });
  }
}

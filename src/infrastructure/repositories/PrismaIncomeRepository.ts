import { Income } from '../../domain/entities/Income';
import {
  FindByFilterProps,
  IIncomeRepository,
} from '../../domain/interfaces/IIncomeRepository';
import { prisma } from '../database/Prisma';
import { v4 as uuidv4 } from 'uuid';

export class PrismaIncomeRepository implements IIncomeRepository {
  async findByFilter({
    userId,
    limit,
    cursor = null,
  }: FindByFilterProps): Promise<{
    data: Income[];
    count: number;
    hasMore: boolean;
  }> {
    const where = {
      userId,
    };

    const incomes = await prisma.income.findMany({
      where,
      take: 10 + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        date: 'desc',
      },
    });

    const count = await prisma.income.count({ where });

    const hasMore = incomes.length > limit;
    const data = hasMore ? incomes.slice(0, -1) : incomes;

    return {
      data,
      count,
      hasMore,
    };
  }

  async find({
    where: { id, userId },
  }: {
    where: { id: string; userId: string };
  }): Promise<Income | null> {
    const income = await prisma.income.findUnique({ where: { id, userId } });
    if (!income) return null;

    return income;
  }

  async create(userId: string, income: Income): Promise<Income> {
    const created = await prisma.income.create({
      data: {
        id: uuidv4(),
        userId,
        categoryId: income.categoryId,
        categoryName: income.categoryName,
        name: income.name,
        amount: income.amount,
        date: income.date ?? new Date(),
        currency: income.currency,
        recurrence: income.recurrence,
        description: income.description ?? '',
        updatedAt: new Date(),
      },
    });

    return created;
  }

  async update(id: string, income: Income): Promise<Income> {
    const data = {
      categoryId: income.categoryId,
      categoryName: income.categoryName,
      name: income.name,
      amount: income.amount,
      date: income.date,
      currency: income.currency,
      recurrence: income.recurrence,
      description: income.description ?? '',
      updatedAt: new Date(),
    };

    return prisma.income.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Income> {
    return prisma.income.delete({ where: { id } });
  }
}

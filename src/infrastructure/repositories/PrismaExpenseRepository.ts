import { Expense } from '../../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../../domain/interfaces/IExpenseRepository';
import { prisma } from '../database/Prisma';
import { v4 as uuidv4 } from 'uuid';

export class PrismaExpenseRepository implements IExpenseRepository {
  async findByFilter({
    userId,
    limit,
    cursor = null,
  }: FindByFilterProps): Promise<{
    data: Expense[];
    count: number;
    hasMore: boolean;
  }> {
    const where = {
      userId,
    };

    const expenses = await prisma.expense.findMany({
      where,
      take: 10 + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        date: 'desc',
      },
    });

    const count = await prisma.expense.count({ where });

    const hasMore = expenses.length > limit;
    const data = hasMore ? expenses.slice(0, -1) : expenses;

    return {
      data,
      count,
      hasMore,
    };
  }

  async findById(id: string): Promise<Expense | null> {
    return prisma.expense.findUnique({ where: { id } });
  }

  async create(userId: string, expense: Expense): Promise<Expense> {
    const data = {
      id: uuidv4(),
      userId,
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      date: expense.date ?? new Date(),
      updatedAt: new Date(),
      currency: expense.currency,
    };

    return prisma.expense.create({ data });
  }

  async update(id: string, expense: Expense): Promise<Expense> {
    console.log(expense);
    const data = {
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      date: expense.date ?? new Date(),
      updatedAt: new Date(),
      currency: expense.currency,
    };

    return prisma.expense.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<Expense> {
    return prisma.expense.delete({
      where: { id },
    });
  }
}

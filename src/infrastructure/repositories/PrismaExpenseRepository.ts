import { Expense } from '../../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../../domain/interfaces/IExpenseRepository';
import prisma from '../models/PrismaClient';

export class PrismaExpenseRepository implements IExpenseRepository {
  async findByFilter({
    userId,
    limit,
    searchString,
    cursor = null,
  }: FindByFilterProps): Promise<{
    data: Expense[];
    count: number;
    hasMore: boolean;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      userId,
    };

    if (searchString) {
      where.OR = [
        { name: { contains: searchString, mode: 'insensitive' } },
        { description: { contains: searchString, mode: 'insensitive' } },
        { categoryName: { contains: searchString, mode: 'insensitive' } },
        { amount: { equals: Number(searchString) } },
      ];
    }

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

    return { data, count, hasMore };
  }

  findById(id: string): Promise<Expense | null> {
    return prisma.expense.findUnique({ where: { id } });
  }

  create(userId: string, expense: Expense): Promise<Expense> {
    return prisma.expense.create({
      data: { ...expense, userId },
    });
  }
  update(id: string, expense: Expense): Promise<Expense> {
    return prisma.expense.update({
      where: { id },
      data: expense,
    });
  }
  delete(id: string): Promise<Expense> {
    return prisma.expense.delete({
      where: { id },
    });
  }
}

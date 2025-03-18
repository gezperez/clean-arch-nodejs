import { Expense } from '../../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../../domain/interfaces/IExpenseRepository';
import { prisma } from '../database/Prisma';
import { Prisma } from '@prisma/client';

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
    const where: Prisma.ExpenseWhereInput = {
      userId,
    };

    if (searchString) {
      where.OR = [{ amount: { equals: Number(searchString) } }];
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

    return {
      data: data.map(
        (expense) =>
          new Expense(
            expense.id,
            expense.userId,
            expense.categoryId,
            expense.name,
            expense.amount,
            expense.date,
          ),
      ),
      count,
      hasMore,
    };
  }

  async findById(id: string): Promise<Expense | null> {
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) return null;

    return new Expense(
      expense.id,
      expense.userId,
      expense.categoryId,
      expense.name,
      expense.amount,
      expense.date,
    );
  }

  async create(userId: string, expense: Expense): Promise<Expense> {
    const data: Prisma.ExpenseUncheckedCreateInput = {
      id: expense.id,
      userId,
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
      updatedAt: new Date(),
    };

    const created = await prisma.expense.create({ data });

    return new Expense(
      created.id,
      created.userId,
      created.categoryId,
      created.name,
      created.amount,
      created.date,
    );
  }

  async update(id: string, expense: Expense): Promise<Expense> {
    const data: Prisma.ExpenseUncheckedUpdateInput = {
      categoryId: expense.categoryId,
      name: expense.name,
      amount: expense.amount,
      date: expense.date,
      updatedAt: new Date(),
    };

    const updated = await prisma.expense.update({
      where: { id },
      data,
    });

    return new Expense(
      updated.id,
      updated.userId,
      updated.categoryId,
      updated.name,
      updated.amount,
      updated.date,
    );
  }

  async delete(id: string): Promise<Expense> {
    const deleted = await prisma.expense.delete({
      where: { id },
    });

    return new Expense(
      deleted.id,
      deleted.userId,
      deleted.categoryId,
      deleted.name,
      deleted.amount,
      deleted.date,
    );
  }
}

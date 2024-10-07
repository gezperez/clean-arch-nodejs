import { Expense } from '../entities/Expense';

export interface FindByFilterProps {
  userId: string;
  cursor?: string | null;
  limit?: number;
  searchString?: string;
}

export interface IExpenseRepository {
  findByFilter({
    userId,
    cursor,
    limit,
    searchString,
  }: FindByFilterProps): Promise<{
    data: Expense[];
    count: number;
    hasMore: boolean;
  }>;
  findById(expenseId: string): Promise<Expense | null>;
  create(userId: string, expense: Expense): Promise<Expense>;
  update(expenseId: string, expense: Expense): Promise<Expense>;
  delete(expenseId: string): Promise<Expense>;
}

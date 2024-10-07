import { Expense } from '../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../domain/interfaces/IExpenseRepository';

export class ExpenseUseCases {
  constructor(private expenseRepository: IExpenseRepository) {}

  async findByFilter(props: FindByFilterProps): Promise<{
    data: Expense[];
    count: number;
    hasMore: boolean;
  }> {
    return this.expenseRepository.findByFilter(props);
  }

  async findById(expenseId: string): Promise<Expense | null> {
    return this.expenseRepository.findById(expenseId);
  }

  async create(userId: string, expense: Expense): Promise<Expense> {
    return this.expenseRepository.create(userId, expense);
  }

  async update(expenseId: string, expense: Expense): Promise<Expense> {
    return this.expenseRepository.update(expenseId, expense);
  }

  async delete(expenseId: string): Promise<Expense> {
    return this.expenseRepository.delete(expenseId);
  }
}

import { Expense } from '../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../domain/interfaces/IExpenseRepository';
import { HttpError } from '../interface/middleware/error';

export class ExpenseUseCases {
  constructor(private expenseRepository: IExpenseRepository) {}

  async findByFilter(props: FindByFilterProps): Promise<{
    data: Expense[];
    count: number;
    hasMore: boolean;
  }> {
    return this.expenseRepository.findByFilter(props);
  }

  async findById(id: string): Promise<Expense | null> {
    const foundExpense = await this.expenseRepository.findById(id);

    if (!foundExpense) {
      throw new HttpError(404, 'Expense not found');
    }

    return foundExpense;
  }

  async create(userId: string, expense: Expense): Promise<Expense> {
    return this.expenseRepository.create(userId, expense);
  }

  async update(id: string, expense: Expense): Promise<Expense> {
    const foundExpense = await this.expenseRepository.findById(id);

    if (!foundExpense) {
      throw new HttpError(404, 'Expense not found');
    }

    return this.expenseRepository.update(id, expense);
  }

  async delete(id: string): Promise<Expense> {
    return this.expenseRepository.delete(id);
  }
}

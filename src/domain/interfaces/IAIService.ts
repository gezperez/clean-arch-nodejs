import { Category } from '../entities/Category';
import { Expense } from '../entities/Expense';

export interface IAIService {
  createWithAI(
    userId: string,
    message: string,
    categories: Category[],
  ): Promise<Expense>;
}

import { Expense } from '../entities/Expense';

export interface IAIRepository {
  generatePrompt(question: string, data: Expense[]): Promise<string>;
}

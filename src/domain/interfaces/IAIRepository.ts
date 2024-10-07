import { Expense } from "../entities/AI";

export interface IAIRepository {
  generatePrompt(question: string, data: Expense[]): Promise<string>;
}

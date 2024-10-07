import { IAIRepository } from '../domain/interfaces/IAIRepository';
import { ExpenseUseCases } from './ExpenseUseCases';

export class AIUseCases {
  constructor(
    private aiRepository: IAIRepository,
    private expenseUseCases: ExpenseUseCases,
  ) {}

  async generatePrompt(question: string, userId: string): Promise<string> {
    const expenses = await this.expenseUseCases.findByFilter({ userId });

    return this.aiRepository.generatePrompt(question, expenses.data);
  }
}

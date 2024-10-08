import { IAIRepository } from '../domain/interfaces/IAIRepository';
import { IExpenseRepository } from '../domain/interfaces/IExpenseRepository';

export class AIUseCases {
  constructor(
    private aiRepository: IAIRepository,
    private expenseRepository: IExpenseRepository,
  ) {}

  async generatePrompt(question: string, userId: string): Promise<string> {
    const expenses = await this.expenseRepository.findByFilter({ userId });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await this.aiRepository.generatePrompt(
      question,
      expenses.data,
    );

    return response?.data?.candidates[0].content.parts[0];
  }
}

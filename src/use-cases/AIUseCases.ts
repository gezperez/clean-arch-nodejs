import { Expense } from '../domain/entities/Expense';
import { IAIRepository } from '../domain/interfaces/IAIRepository';

export class AIUseCases {
  constructor(private aiRepository: IAIRepository) {}

  async generatePrompt(question: string, data: Expense[]): Promise<string> {
    return this.aiRepository.generatePrompt(question, data);
  }
}

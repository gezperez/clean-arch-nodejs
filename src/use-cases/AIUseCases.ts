import { Expense } from '../domain/entities/Expense';
import { IAIService } from '../domain/interfaces/IAIService';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { IExpenseRepository } from '../domain/interfaces/IExpenseRepository';
export class AIUseCases {
  constructor(
    private aiService: IAIService,
    private categoryRepository: ICategoryRepository,
    private expenseRepository: IExpenseRepository,
  ) {}

  async createWithAI(userId: string, message: string): Promise<Expense> {
    const categories = await this.categoryRepository.findAll();

    const expense = await this.aiService.createWithAI(
      userId,
      message,
      categories,
    );

    await this.expenseRepository.create(userId, expense);

    return expense;
  }
}

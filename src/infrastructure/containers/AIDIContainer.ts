import { AIUseCases } from '../../use-cases/AIUseCases';
import { GeminiService } from '../services/GeminiService';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaExpenseRepository } from '../repositories/PrismaExpenseRepository';
class AIIContainer {
  private static _aiService = new GeminiService();
  private static _categoryRepository = new PrismaCategoryRepository();
  private static _expenseRepository = new PrismaExpenseRepository();

  static getUseCases() {
    return new AIUseCases(
      this._aiService,
      this._categoryRepository,
      this._expenseRepository,
    );
  }
}

export { AIIContainer };

import { AIUseCases } from '../../use-cases/AIUseCases';
import { GeminiService } from '../services/GeminiService';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';
import { PrismaMovementRepository } from '../repositories/PrismaMovementRepository';
class AIIContainer {
  private static _aiService = new GeminiService();
  private static _categoryRepository = new PrismaCategoryRepository();
  private static _movementRepository = new PrismaMovementRepository();

  static getUseCases() {
    return new AIUseCases(
      this._aiService,
      this._categoryRepository,
      this._movementRepository,
    );
  }
}

export { AIIContainer };

import { AIUseCases } from '../../use-cases/AIUseCases';
import { GeminiAIRepository } from '../repositories/GeminiAIRepository';
import { ExpenseDIContainer } from './ExpenseDIContainer';

class AIIContainer {
  private static _aiRepository = new GeminiAIRepository();
  private static _expenseRepository = ExpenseDIContainer.getRepository();

  static getUseCases() {
    return new AIUseCases(this._aiRepository, this._expenseRepository);
  }

  static getRepository() {
    return this._aiRepository;
  }
}

export { AIIContainer };

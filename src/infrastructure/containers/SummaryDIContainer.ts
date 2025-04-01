import { SummaryUseCases } from '../../use-cases/SummaryUseCases';
import { PrismaSummaryRepository } from '../repositories/PrismaSummaryRepository';
import { RateService } from '../services/RateService';

class SummaryDIContainer {
  private static _summaryRepository = new PrismaSummaryRepository(
    RateService.getInstance(),
  );

  static getUseCases() {
    return new SummaryUseCases(this._summaryRepository);
  }

  static getRepository() {
    return this._summaryRepository;
  }
}

export { SummaryDIContainer };

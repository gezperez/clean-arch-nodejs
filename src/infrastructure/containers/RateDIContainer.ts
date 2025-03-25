import { RateUseCases } from '../../use-cases/RateUseCases';
import { RateService } from '../services/RateService';

class RateDIContainer {
  private static _rateService = RateService.getInstance();

  static getUseCases() {
    return new RateUseCases(this._rateService);
  }
}

export { RateDIContainer };

import { RateUseCases } from '../../use-cases/RateUseCases';
import { RateService } from '../services/RateService';

class RateDIContainer {
  private static _rateService = new RateService();

  static getUseCases() {
    return new RateUseCases(this._rateService);
  }

}

export { RateDIContainer };

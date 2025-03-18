import { ConversionRates } from '../domain/entities/Currency';
import { RateService } from '../infrastructure/services/RateService';

export class RateUseCases {
  constructor(private rateService: RateService) {}

  async getRates(): Promise<ConversionRates> {
    return this.rateService.getRates();
  }
}

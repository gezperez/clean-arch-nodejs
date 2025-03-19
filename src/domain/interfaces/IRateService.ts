import { ConversionRates } from '../entities/Currency';

export interface IRateService {
  getBlueRate(): Promise<number>;
  getRates(): Promise<ConversionRates>;
}

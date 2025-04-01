import { ConversionRates } from '../../domain/entities/Currency';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../interface/middleware/environment';
import { BlueRateResponse, RatesResponse } from '../../domain/responses/Rate';
import { IRateService } from '../../domain/interfaces/IRateService';
import { logger } from '../logger';

export class RateService implements IRateService {
  private static instance: RateService;
  private cachedRates: ConversionRates | null = null;
  private lastUpdated: Date | null = null;

  private constructor() {}

  static getInstance(): RateService {
    if (!RateService.instance) {
      RateService.instance = new RateService();
    }
    return RateService.instance;
  }

  // For testing purposes only
  static resetInstance(): void {
    RateService.instance = null as unknown as RateService;
  }

  async getBlueRate(): Promise<number> {
    const url = `${environment.usdApiUrl}`;
    const response: AxiosResponse<BlueRateResponse, Error> =
      await axios.get(url);
    return response.data.compra;
  }

  async getRates(): Promise<ConversionRates> {
    if (this.cachedRates) {
      return this.cachedRates;
    }

    // If no cached rates available, fetch them
    return this.fetchAndUpdateRates();
  }

  async fetchAndUpdateRates(): Promise<ConversionRates> {
    try {
      const url = `${environment.exchangeRateApiUrl}${environment.exchangeRateApiKey}/latest/USD`;
      const response: AxiosResponse<RatesResponse, Error> =
        await axios.get(url);
      const rates = response.data.conversion_rates;
      rates['ARS'] = await this.getBlueRate();

      this.cachedRates = rates;
      this.lastUpdated = new Date();

      return rates;
    } catch (error) {
      logger.error('Error fetching rates:', error);
      // Remove the cached rates fallback and throw the error
      throw error instanceof Error
        ? error
        : new Error('Unknown error fetching rates');
    }
  }
}

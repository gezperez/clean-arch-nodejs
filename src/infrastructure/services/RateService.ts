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

  async getBlueRate(): Promise<number> {
    const url = `${environment.usdApiUrl}`;
    const response: AxiosResponse<BlueRateResponse, Error> =
      await axios.get(url);
    return response.data.compra;
  }

  async getRates(): Promise<ConversionRates> {
    if (this.cachedRates) {
      logger.debug('Returning cached rates, last updated:', this.lastUpdated);
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
      logger.debug('Rates updated at:', this.lastUpdated);

      return rates;
    } catch (error) {
      logger.error('Error fetching rates:', error);
      // If we have cached rates and there's an error, return cached rates
      if (this.cachedRates) {
        logger.warn('Returning stale cached rates due to fetch error');
        return this.cachedRates;
      }
      throw error;
    }
  }
}

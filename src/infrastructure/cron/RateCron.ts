import cron from 'node-cron';
import { RateUseCases } from '../../use-cases/RateUseCases';
import { RateDIContainer } from '../containers/RateDIContainer';
import { logger } from '../logger';
import { RateService } from '../services/RateService';

export class RateCron {
  private rateUseCases: RateUseCases;
  private rateService: RateService;

  constructor() {
    this.rateUseCases = RateDIContainer.getUseCases();
    this.rateService = RateService.getInstance();
  }

  start() {
    // Fetch rates immediately on startup
    this.fetchRates();

    // Schedule task to run at 10 AM every day
    cron.schedule('0 10 * * *', () => this.fetchRates());
  }

  private async fetchRates() {
    try {
      logger.info('Starting daily rate fetch');
      await this.rateService.fetchAndUpdateRates();
      logger.info('Successfully fetched and cached daily rates');
    } catch (error) {
      logger.error('Error fetching daily rates:', error);
    }
  }
}

import {
  ISummaryRepository,
  Statistics,
  DailyStatistics,
} from '../domain/interfaces/ISummaryRepository';

export class SummaryUseCases {
  constructor(private summaryRepository: ISummaryRepository) {}

  async getStatistics(userId: string, year: number): Promise<Statistics[]> {
    return this.summaryRepository.getStatistics(userId, year);
  }

  async getDailyStatistics(
    userId: string,
    year: number,
    month: number,
  ): Promise<DailyStatistics[]> {
    return this.summaryRepository.getDailyStatistics(userId, year, month);
  }
}

import { Movement } from '../entities/Movement';

export interface SummaryPeriod {
  startDate: Date;
  endDate: Date;
  totalAmount: number;
  count: number;
  currency: string;
  movements: Movement[];
}

export interface SummaryByCategory extends SummaryPeriod {
  categoryId: string;
  categoryName: string;
}

export interface CategoryStatistics {
  name: string;
  totalExpendedPerCurrency: number;
  totalRemainingPerCurrency: number;
  totalExpendedPerConversionCurrency: number;
  totalRemainingPerConversionCurrency: number;
  percentageExpended: number;
  percentageRemaining: number;
  currency: string;
  conversionCurrency: string;
}

export interface DifferenceStats {
  totalExpended: number;
  totalRemaining: number;
  percentageExpended: number;
  percentageRemaining: number;
}

export interface Statistics {
  month: number;
  averageExpended: number;
  averageRemaining: number;
  difference: DifferenceStats;
  totalExpendedPerCurrency: number;
  totalRemainingPerCurrency: number;
  totalIncomePerCurrency: number;
  totalExpendedPerConversionCurrency: number;
  totalRemainingPerConversionCurrency: number;
  totalIncomePerConversionCurrency: number;
  currency: string;
  conversionCurrency: string;
  categories: CategoryStatistics[];
  percentageExpended: number;
  percentageRemaining: number;
}

export interface DailyStatistics {
  month: number;
  day: number;
  totalExpendedPerCurrency: number;
  totalExpendedPerConversionCurrency: number;
  currency: string;
  conversionCurrency: string;
  movements: Movement[];
}

export interface ISummaryRepository {
  getStatistics(userId: string, year: number): Promise<Statistics[]>;
  getDailyStatistics(
    userId: string,
    year: number,
    month: number,
  ): Promise<DailyStatistics[]>;
}

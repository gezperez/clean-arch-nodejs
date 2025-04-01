import {
  ISummaryRepository,
  Statistics,
  DifferenceStats,
  DailyStatistics,
} from '../../domain/interfaces/ISummaryRepository';
import { prisma } from '../database/Prisma';
import { Movement, Prisma } from '@prisma/client';
import { RateService } from '../services/RateService';
import { formatCurrency } from '../../interface/utils/string';

export class PrismaSummaryRepository implements ISummaryRepository {
  constructor(private rateService: RateService) {}

  private async findMany(args: Prisma.MovementFindManyArgs) {
    return prisma.movement.findMany({
      ...args,
      include: {
        category: true,
      },
    });
  }

  private async getConversionRate(from: string, to: string): Promise<number> {
    if (from === to) return 1;
    const rates = await this.rateService.getRates();
    const fromRate = rates[from] || 1;
    const toRate = rates[to] || 1;
    return toRate / fromRate;
  }

  private calculateDifference(
    currentExpended: number,
    currentRemaining: number,
    previousExpended: number,
    previousRemaining: number,
  ): DifferenceStats {
    const totalExpended = currentExpended - previousExpended;
    const totalRemaining = currentRemaining - previousRemaining;

    const percentageExpended =
      previousExpended === 0
        ? currentExpended > 0
          ? 100
          : 0
        : (currentExpended / previousExpended) * 100;

    const percentageRemaining =
      previousRemaining === 0
        ? currentRemaining > 0
          ? 100
          : 0
        : (currentRemaining / previousRemaining) * 100;

    return {
      totalExpended,
      totalRemaining,
      percentageExpended,
      percentageRemaining,
    };
  }

  private async monthlyPercentages(
    userId: string,
    year: number,
    month: number,
    currentMovements: Array<{ amount: number | string; currency: string }>,
  ): Promise<{
    expendedPercentage: number;
    remainingPercentage: number;
    remainingAmount: number;
  }> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    const userCurrency = user?.currency || 'USD';

    // Only fetch the other type of movements we need
    const otherMovements = await this.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Convert current movements to user currency
    const currentTotal = await currentMovements.reduce(
      async (accPromise, movement) => {
        const acc = await accPromise;
        const rate = await this.getConversionRate(
          movement.currency,
          userCurrency,
        );
        return acc + Number(movement.amount) * rate;
      },
      Promise.resolve(0),
    );

    // Convert other movements to user currency
    const otherTotal = await otherMovements.reduce(
      async (accPromise, movement) => {
        const acc = await accPromise;
        const rate = await this.getConversionRate(
          movement.currency,
          userCurrency,
        );
        return acc + Number(movement.amount) * rate;
      },
      Promise.resolve(0),
    );

    // Calculate percentages based on type
    const totalExpenses = currentTotal;
    const totalIncome = otherTotal;

    const expendedPercentage =
      totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0;
    const remainingPercentage = totalIncome > 0 ? 100 - expendedPercentage : 0;
    const remainingAmount = totalIncome - totalExpenses;
    return { expendedPercentage, remainingPercentage, remainingAmount };
  }

  async getStatistics(userId: string, year: number): Promise<Statistics[]> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Get user's preferred currency
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currency: true, conversionCurrency: true },
    });
    const userCurrency = user?.currency || 'USD';
    const conversionCurrency = user?.conversionCurrency || 'USD';

    // Get all movements for the current year
    const movements = await this.findMany({
      where: {
        userId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        category: true,
      },
    });

    const monthlyStats: Statistics[] = [];

    // Process each month
    for (let month = 1; month <= 12; month++) {
      const monthMovements = movements.filter(
        (movement) => new Date(movement.createdAt).getMonth() + 1 === month,
      );

      // Get last year's movements for comparison
      const lastYearMovements =
        month === 1
          ? await this.findMany({
              where: {
                userId,
                createdAt: {
                  gte: new Date(year - 1, 11, 1),
                  lte: new Date(year - 1, 11, 31, 23, 59, 59),
                },
              },
              orderBy: {
                createdAt: 'asc',
              },
            })
          : [];

      const lastMonthMovements =
        month === 1
          ? lastYearMovements.filter(
              (movement) => new Date(movement.createdAt).getMonth() + 1 === 12,
            )
          : movements.filter(
              (movement) =>
                new Date(movement.createdAt).getMonth() + 1 === month - 1,
            );

      // Calculate monthly totals with currency conversion
      const monthlyTotals = await monthMovements.reduce(
        async (accPromise, movement) => {
          const acc = await accPromise;
          const toUserCurrencyRate = await this.getConversionRate(
            movement.currency,
            userCurrency,
          );
          const amountInUserCurrency =
            Number(movement.amount) * toUserCurrencyRate;

          return {
            expended:
              acc.expended +
              (movement.type === 'EXPENSE' ? amountInUserCurrency : 0),
            remaining:
              acc.remaining +
              (movement.type === 'INCOME' ? amountInUserCurrency : 0),
          };
        },
        Promise.resolve({ expended: 0, remaining: 0 }),
      );

      // Calculate last month totals
      const lastMonthTotals = await lastMonthMovements.reduce(
        async (accPromise, movement) => {
          const acc = await accPromise;
          const toUserCurrencyRate = await this.getConversionRate(
            movement.currency,
            userCurrency,
          );
          const amountInUserCurrency =
            Number(movement.amount) * toUserCurrencyRate;

          return {
            expended:
              acc.expended +
              (movement.type === 'EXPENSE' ? amountInUserCurrency : 0),
            remaining:
              acc.remaining +
              (movement.type === 'INCOME' ? amountInUserCurrency : 0),
          };
        },
        Promise.resolve({ expended: 0, remaining: 0 }),
      );

      const difference = this.calculateDifference(
        monthlyTotals.expended,
        monthlyTotals.remaining,
        lastMonthTotals.expended,
        lastMonthTotals.remaining,
      );

      // Calculate averages
      const expenseMovements = monthMovements.filter(
        (m) => m.type === 'EXPENSE',
      );
      const incomeMovements = monthMovements.filter((m) => m.type === 'INCOME');

      const averageExpended =
        expenseMovements.length > 0
          ? monthlyTotals.expended / expenseMovements.length
          : 0;

      const averageRemaining =
        incomeMovements.length > 0
          ? monthlyTotals.remaining / incomeMovements.length
          : 0;

      // Group by category with proper currency conversion
      const categoryMap = new Map<
        string,
        {
          totalExpendedInUserCurrency: number;
          totalRemainingInUserCurrency: number;
          totalExpendedInConversionCurrency: number;
          totalRemainingInConversionCurrency: number;
          totalIncomeInConversionCurrency: number;
          totalIncomeInUserCurrency: number;
        }
      >();

      // Process each movement for categories
      for (const movement of monthMovements) {
        const key = movement.category?.name || 'Uncategorized';
        const current = categoryMap.get(key) || {
          totalExpendedInUserCurrency: 0,
          totalRemainingInUserCurrency: 0,
          totalExpendedInConversionCurrency: 0,
          totalRemainingInConversionCurrency: 0,
          totalIncomeInConversionCurrency: 0,
          totalIncomeInUserCurrency: 0,
        };

        const amount = Number(movement.amount);

        // Convert to user currency
        const toUserCurrencyRate = await this.getConversionRate(
          movement.currency,
          userCurrency,
        );
        const amountInUserCurrency = amount * toUserCurrencyRate;

        // Convert to conversion currency
        const toConversionCurrencyRate = await this.getConversionRate(
          movement.currency,
          conversionCurrency,
        );

        const amountInConversionCurrency = amount * toConversionCurrencyRate;

        // Update the category totals
        const newTotals = {
          totalExpendedInUserCurrency:
            current.totalExpendedInUserCurrency +
            (movement.type === 'EXPENSE' ? amountInUserCurrency : 0),
          totalRemainingInUserCurrency:
            current.totalRemainingInUserCurrency +
            (movement.type === 'INCOME' ? amountInUserCurrency : 0),
          totalExpendedInConversionCurrency:
            current.totalExpendedInConversionCurrency +
            (movement.type === 'EXPENSE' ? amountInConversionCurrency : 0),
          totalRemainingInConversionCurrency:
            current.totalRemainingInConversionCurrency +
            (movement.type === 'INCOME' ? amountInConversionCurrency : 0),
          totalIncomeInConversionCurrency:
            current.totalIncomeInConversionCurrency +
            (movement.type === 'INCOME' ? amountInConversionCurrency : 0),
          totalIncomeInUserCurrency:
            current.totalIncomeInUserCurrency +
            (movement.type === 'INCOME' ? amountInUserCurrency : 0),
        };

        categoryMap.set(key, newTotals);
      }

      const categories = Array.from(categoryMap.entries()).map(
        ([name, category]) => ({
          name,
          totalExpendedPerCurrency: formatCurrency(
            category.totalExpendedInUserCurrency,
          ),
          totalRemainingPerCurrency: formatCurrency(
            category.totalRemainingInUserCurrency,
          ),
          totalExpendedPerConversionCurrency: formatCurrency(
            category.totalExpendedInConversionCurrency,
          ),
          totalRemainingPerConversionCurrency: formatCurrency(
            category.totalRemainingInConversionCurrency,
          ),
          percentageExpended:
            monthlyTotals.expended > 0
              ? (category.totalExpendedInUserCurrency /
                  monthlyTotals.expended) *
                100
              : 0,
          percentageRemaining:
            monthlyTotals.remaining > 0
              ? (category.totalRemainingInUserCurrency /
                  monthlyTotals.remaining) *
                100
              : 0,
          currency: userCurrency,
          conversionCurrency,
        }),
      );

      const totalExpendedPerConversionCurrency = Array.from(
        categoryMap.values(),
      ).reduce(
        (sum, category) => sum + category.totalExpendedInConversionCurrency,
        0,
      );

      const totalRemainingPerConversionCurrency =
        Array.from(categoryMap.values()).reduce(
          (sum, category) => sum + category.totalRemainingInConversionCurrency,
          0,
        ) -
        Array.from(categoryMap.values()).reduce(
          (sum, category) => sum + category.totalExpendedInConversionCurrency,
          0,
        );

      monthlyStats.push({
        month,
        averageExpended,
        averageRemaining,
        difference,
        totalExpendedPerCurrency: monthlyTotals.expended,
        totalRemainingPerCurrency: formatCurrency(
          monthlyTotals.remaining - monthlyTotals.expended,
        ),
        totalIncomePerCurrency: formatCurrency(monthlyTotals.remaining),
        totalExpendedPerConversionCurrency: formatCurrency(
          totalExpendedPerConversionCurrency,
        ),
        totalRemainingPerConversionCurrency: formatCurrency(
          totalRemainingPerConversionCurrency,
        ),
        totalIncomePerConversionCurrency: formatCurrency(
          Array.from(categoryMap.values()).reduce(
            (sum, category) => sum + category.totalIncomeInConversionCurrency,
            0,
          ),
        ),
        currency: userCurrency,
        conversionCurrency,
        categories,
        percentageExpended:
          monthlyTotals.expended > 0
            ? (monthlyTotals.expended /
                (monthlyTotals.expended + monthlyTotals.remaining)) *
              100
            : 0,
        percentageRemaining:
          monthlyTotals.remaining > 0
            ? (monthlyTotals.remaining /
                (monthlyTotals.expended + monthlyTotals.remaining)) *
              100
            : 0,
      });
    }

    return monthlyStats;
  }

  async getDailyStatistics(
    userId: string,
    year: number,
    month: number,
  ): Promise<DailyStatistics[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // Get user's preferred currency
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { currency: true, conversionCurrency: true },
    });
    const userCurrency = user?.currency || 'USD';
    const conversionCurrency = user?.conversionCurrency || 'USD';

    // Get all expense movements for the specified month
    const movements = await this.findMany({
      where: {
        userId,
        type: 'EXPENSE',
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    // Group movements by day
    const dailyMovements = new Map<number, Movement[]>();
    movements.forEach((movement) => {
      const day = new Date(movement.createdAt).getDate();
      const dayMovements = dailyMovements.get(day) || [];
      dayMovements.push(movement);
      dailyMovements.set(day, dayMovements);
    });

    // Calculate daily statistics
    const dailyStats: DailyStatistics[] = [];
    const daysInMonth = new Date(year, month, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayMovements = dailyMovements.get(day) || [];

      // Calculate totals with currency conversion
      const totals = await dayMovements.reduce(
        async (accPromise, movement) => {
          const acc = await accPromise;
          const amount = Number(movement.amount);

          // Convert to user currency
          const toUserCurrencyRate = await this.getConversionRate(
            movement.currency,
            userCurrency,
          );
          const amountInUserCurrency = amount * toUserCurrencyRate;

          // Convert to conversion currency
          const toConversionCurrencyRate = await this.getConversionRate(
            movement.currency,
            conversionCurrency,
          );
          const amountInConversionCurrency = amount * toConversionCurrencyRate;

          return {
            totalExpendedPerCurrency:
              acc.totalExpendedPerCurrency + amountInUserCurrency,
            totalExpendedPerConversionCurrency:
              acc.totalExpendedPerConversionCurrency +
              amountInConversionCurrency,
          };
        },
        Promise.resolve({
          totalExpendedPerCurrency: 0,
          totalExpendedPerConversionCurrency: 0,
        }),
      );

      dailyStats.push({
        month,
        day,
        totalExpendedPerCurrency: totals.totalExpendedPerCurrency,
        totalExpendedPerConversionCurrency:
          totals.totalExpendedPerConversionCurrency,
        currency: userCurrency,
        conversionCurrency,
        movements: dayMovements,
      });
    }

    return dailyStats;
  }
}

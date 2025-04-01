import { NextFunction, Response } from 'express';
import { SummaryUseCases } from '../../use-cases/SummaryUseCases';
import { HttpError } from '../middleware/error';
import { isValidYear } from '../utils/validation';
import { AuthenticatedRequest } from '../../types/request';

export class SummaryController {
  constructor(private summaryUseCases: SummaryUseCases) {}

  async getStatistics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const { year } = req.body;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const yearNum = parseInt(year);

      if (isNaN(yearNum)) {
        throw new HttpError(400, 'Invalid year format');
      }

      if (!isValidYear(year)) {
        throw new HttpError(400, 'Invalid year provided');
      }

      const statistics = await this.summaryUseCases.getStatistics(
        userId,
        yearNum,
      );

      res.json(statistics);
    } catch (error) {
      next(error);
    }
  }

  async getDailyStatistics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;
      const { year, month } = req.body;

      if (!userId) {
        throw new HttpError(401, 'Unauthorized');
      }

      const yearNum = parseInt(year);
      const monthNum = parseInt(month);

      if (isNaN(yearNum) || isNaN(monthNum)) {
        throw new HttpError(400, 'Invalid year or month format');
      }

      if (!isValidYear(year)) {
        throw new HttpError(400, 'Invalid year provided');
      }

      if (monthNum < 1 || monthNum > 12) {
        throw new HttpError(400, 'Invalid month provided');
      }

      const dailyStatistics = await this.summaryUseCases.getDailyStatistics(
        userId,
        yearNum,
        monthNum,
      );

      res.json(dailyStatistics);
    } catch (error) {
      next(error);
    }
  }
}

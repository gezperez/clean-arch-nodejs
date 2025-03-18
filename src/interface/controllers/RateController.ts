import { NextFunction, Request, Response } from 'express';
import { RateUseCases } from '../../use-cases/RateUseCases';

export class RateController {
  constructor(private rateUseCases: RateUseCases) {}

  async getRates(req: Request, res: Response, next: NextFunction) {   
    try {
      const response = await this.rateUseCases.getRates();
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

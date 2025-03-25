import { validate } from 'class-validator';
import { IncomeUseCases } from '../../use-cases/IncomeUseCases';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../middleware/error';
import { CreateIncomeDTO } from '../../domain/dtos/IncomeDTO';

export class IncomeController {
  constructor(private incomeUseCases: IncomeUseCases) {}

  async findByFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.incomeUseCases.findByFilter(req.body);
      res.json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const income = await this.incomeUseCases.findById(req.params.id);

      res.json(income);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateIncomeDTO(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new HttpError(400, errors.toString());
      }

      const income = await this.incomeUseCases.create(
        req.params.id as string,
        req.body,
      );

      res.json(income);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const income = await this.incomeUseCases.update(
        req.params.id as string,
        req.body,
      );

      res.json(income);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const income = await this.incomeUseCases.delete(req.params.id);

      res.json(income);
    } catch (error) {
      next(error);
    }
  }
}

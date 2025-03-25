import { validate } from 'class-validator';
import { IncomeUseCases } from '../../use-cases/IncomeUseCases';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../middleware/error';
import { CreateIncomeDTO } from '../../domain/dtos/IncomeDTO';
import { JWTPayload } from '../../domain/entities/JWT';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

export class IncomeController {
  constructor(private incomeUseCases: IncomeUseCases) {}

  async findByFilter(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await this.incomeUseCases.findByFilter({
        ...req.body,
        userId: req.user.id,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async find(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const income = await this.incomeUseCases.find(
        req.params.id as string,
        req.user.id,
      );

      res.json(income);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateIncomeDTO(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new HttpError(400, errors.toString());
      }

      const income = await this.incomeUseCases.create(req.user.id, req.body);

      res.json(income);
    } catch (error) {
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    console.log(req.user.id);
    try {
      const income = await this.incomeUseCases.update(req.user.id, req.body);

      res.json(income);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const income = await this.incomeUseCases.delete(req.params.id);

      res.json(income);
    } catch (error) {
      next(error);
    }
  }
}

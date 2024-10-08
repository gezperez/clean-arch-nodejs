import { NextFunction, Request, Response } from 'express';
import { ExpenseUseCases } from '../../use-cases/ExpenseUseCases';
import { CreateExpenseDTO } from '../../domain/dtos/ExpenseDTO';
import { validate } from 'class-validator';
import { HttpError } from '../middleware/error';

export class ExpenseController {
  constructor(private expenseUseCases: ExpenseUseCases) {}

  async findByFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.expenseUseCases.findByFilter(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await this.expenseUseCases.findById(req.params.id);

      res.json(expense);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateExpenseDTO(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new HttpError(400, errors.toString());
      }

      const user = await this.expenseUseCases.create(
        req.params.id as string,
        req.body,
      );
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const expense = await this.expenseUseCases.update(
        req.params.id,
        req.body,
      );

      res.json(expense);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.expenseUseCases.delete(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

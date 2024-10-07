import { Request, Response } from 'express';
import { ExpenseUseCases } from '../../use-cases/ExpenseUseCases';
import { CreateExpenseDTO } from '../../domain/dtos/ExpenseDTO';
import { validate } from 'class-validator';

export class ExpenseController {
  constructor(private expenseUseCases: ExpenseUseCases) {}

  async getByFilter(req: Request, res: Response) {
    const response = await this.expenseUseCases.findByFilter(req.body);
    res.json(response);
  }

  async getById(req: Request, res: Response) {
    const expense = await this.expenseUseCases.findById(req.params.id);

    if (!expense) {
      res.status(404).json({
        errorCode: 404,
        message: 'Expense not found',
      });
      return;
    }

    res.json(expense);
  }

  async create(req: Request, res: Response) {
    const dto = Object.assign(new CreateExpenseDTO(), req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({
        errorCode: 400,
        message: { errors },
      });
      return;
    }

    const user = await this.expenseUseCases.create(
      req.params.id as string,
      req.body,
    );
    res.status(201).json(user);
  }

  async update(req: Request, res: Response) {
    const expenseExists = await this.expenseUseCases.findById(req.params.id);

    if (!expenseExists) {
      res.status(404).json({
        errorCode: 404,
        message: 'Expense not found',
      });
      return;
    }

    const expense = await this.expenseUseCases.update(req.params.id, req.body);

    res.json(expense);
  }

  async delete(req: Request, res: Response) {
    await this.expenseUseCases.delete(req.params.id);
    res.sendStatus(204);
  }
}

import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import { CategoryUseCases } from '../../use-cases/CategoryUseCases';
import { CreateCategoryDTO } from '../../domain/dtos/CategoryDTO';
import { HttpError } from '../middleware/error';

export class CategoryController {
  constructor(private categoryUseCases: CategoryUseCases) {}

  async findAll(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.categoryUseCases.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.categoryUseCases.findById(
        req.params.id as string,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateCategoryDTO(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new HttpError(400, errors.toString());
      }

      const category = await this.categoryUseCases.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const category = await this.categoryUseCases.update(
        req.params.id,
        req.body,
      );

      res.json(category);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.categoryUseCases.delete(req.query.id as string);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

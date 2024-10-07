import { validate } from 'class-validator';
import { Request, Response } from 'express';
import { CategoryUseCases } from '../../use-cases/CategoryUseCases';
import { CreateCategoryDTO } from '../../domain/dtos/CategoryDTO';

export class CategoryController {
  constructor(private categoryUseCases: CategoryUseCases) {}

  async getAll(req: Request, res: Response) {
    const users = await this.categoryUseCases.findAll();
    res.json(users);
  }

  async getById(req: Request, res: Response) {
    const category = await this.categoryUseCases.findById(
      req.params.id as string,
    );
    if (category) {
      res.json(category);
    } else {
      res.status(404).json({
        errorCode: 404,
        message: 'Category not found',
      });
    }
  }

  async create(req: Request, res: Response) {
    const dto = Object.assign(new CreateCategoryDTO(), req.body);
    const errors = await validate(dto);

    if (errors.length > 0) {
      res.status(400).json({
        errorCode: 400,
        message: { errors },
      });
      return;
    }

    const category = await this.categoryUseCases.create(req.body);
    res.status(201).json(category);
  }

  async update(req: Request, res: Response) {
    const categoryExists = await this.categoryUseCases.findById(req.params.id);

    if (!categoryExists) {
      res.status(404).json({
        errorCode: 404,
        message: 'Category not found',
      });
      return;
    }

    const category = await this.categoryUseCases.update(
      req.params.id,
      req.body,
    );

    res.json(category);
  }

  async delete(req: Request, res: Response) {
    await this.categoryUseCases.delete(req.query.id as string);
    res.sendStatus(204);
  }
}

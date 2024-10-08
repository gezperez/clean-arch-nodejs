import { validate } from 'class-validator';
import { UserUseCases } from '../../use-cases/UserUseCases';
import { NextFunction, Request, Response } from 'express';
import { CreateUserDTO } from '../../domain/dtos/UserDTO';
import { HttpError } from '../middleware/error';

export class UserController {
  constructor(private userUseCases: UserUseCases) {}

  async findAll(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await this.userUseCases.findAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userUseCases.findById(req.params.id as string);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = Object.assign(new CreateUserDTO(), req.body);
      const errors = await validate(dto);

      if (errors.length > 0) {
        throw new HttpError(400, errors.toString());
      }

      const user = await this.userUseCases.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userUseCases.update(req.params.id, req.body);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.userUseCases.delete(req.query.id as string);
      res.sendStatus(204);
    } catch (error) {
      next(error);
    }
  }
}

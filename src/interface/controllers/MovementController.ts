import { NextFunction, Request, Response } from 'express';
import { MovementUseCases } from '../../use-cases/MovementUseCases';
import { AuthenticatedRequest } from '../../types/request';

export class MovementController {
  constructor(private movementUseCases: MovementUseCases) {}

  async findByFilter(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.movementUseCases.findByFilter(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async find(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.movementUseCases.find(
        req.params.id,
        req.params.userId,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async create(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    console.log('aca 1', req.body);
    try {
      const response = await this.movementUseCases.create(
        req.user.id,
        req.body,
      );
      res.status(201).json(response);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const response = await this.movementUseCases.update(
        req.user.id,
        req.body,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const response = await this.movementUseCases.delete(
        req.user.id,
        req.params.id,
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

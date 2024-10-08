import { AuthUseCases } from '../../use-cases/AuthUseCases';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
  constructor(private authUseCases: AuthUseCases) {}

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authUseCases.login(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  }

  async refreshAccessToken(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.authUseCases.refreshAccessToken(
        req.body.refreshToken,
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

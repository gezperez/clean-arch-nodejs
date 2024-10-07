import { IHashRepository } from '../../domain/interfaces/IHashRepository';
import { AuthUseCases } from '../../use-cases/AuthUserCases';
import { Request, Response } from 'express';
import { UserUseCases } from '../../use-cases/UserUseCases';

export class AuthController {
  constructor(
    private authUseCases: AuthUseCases,
    private hashRepository: IHashRepository,
    private userUseCases: UserUseCases,
  ) {}

  async login(req: Request, res: Response) {
    try {
      const user = await this.userUseCases.findByEmail(req.body.email);

      const isPasswordValid = await this.hashRepository.verifyPassword(
        user.password,
        req.body.password,
      );

      if (!user) {
        res.status(404).json({
          errorCode: 404,
          message: 'User not found',
        });
        return;
      }

      if (!isPasswordValid) {
        res.status(400).json({
          errorCode: 400,
          message: 'Invalid credentials',
        });
        return;
      }

      const response = await this.authUseCases.login(req.body);
      res.json(response);
    } catch (error) {

      res.status(400).json({
        errorCode: 400,
        message: error,
      });
    }
  }
}

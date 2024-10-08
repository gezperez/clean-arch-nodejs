import { AIUseCases } from '../../use-cases/AIUseCases';
import { NextFunction, Request, Response } from 'express';

export class AIController {
  constructor(private aiCases: AIUseCases) {}

  async generatePrompt(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await this.aiCases.generatePrompt(
        req.body.question,
        req.params.id,
      );

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

import { AIUseCases } from '../../use-cases/AIUserCases';
import { Request, Response } from 'express';

export class AIController {
  constructor(private aiCases: AIUseCases) {}

  async generatePrompt(req: Request, res: Response) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await this.aiCases.generatePrompt(
        req.body.question,
        req.body.data,
      );

      const data = response?.data?.candidates[0].content.parts[0];

      console.log(JSON.stringify(data, null, 2));

      res.json(data);
    } catch (error) {
      res.status(400).json({
        errorCode: 400,
        message: error,
      });
    }
  }
}

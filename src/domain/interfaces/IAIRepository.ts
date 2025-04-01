import { Movement } from '../entities/Movement';

export interface IAIRepository {
  generatePrompt(question: string, data: Movement[]): Promise<string>;
}

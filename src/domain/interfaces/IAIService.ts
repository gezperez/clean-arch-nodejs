import { Category } from '../entities/Category';
import { Movement, MovementType } from '../entities/Movement';

export interface IAIService {
  createWithAI(
    userId: string,
    message: string,
    categories: Category[],
    type: MovementType,
  ): Promise<Movement>;
}

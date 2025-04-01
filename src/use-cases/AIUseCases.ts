import { Movement, MovementType } from '../domain/entities/Movement';
import { IAIService } from '../domain/interfaces/IAIService';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { IMovementRepository } from '../domain/interfaces/IMovementRepository';
export class AIUseCases {
  constructor(
    private aiService: IAIService,
    private categoryRepository: ICategoryRepository,
    private movementRepository: IMovementRepository,
  ) {}

  async createWithAI(
    userId: string,
    message: string,
    type: MovementType,
  ): Promise<Movement> {
    const categories = await this.categoryRepository.findAll();

    const movement = await this.aiService.createWithAI(
      userId,
      message,
      categories,
      type,
    );

    await this.movementRepository.create(userId, movement);

    return movement;
  }
}

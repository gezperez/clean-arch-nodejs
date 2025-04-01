import { Movement } from '../domain/entities/Movement';
import {
  FindByFilterProps,
  IMovementRepository,
} from '../domain/interfaces/IMovementRepository';
import { HttpError } from '../interface/middleware/error';

export class MovementUseCases {
  constructor(private movementRepository: IMovementRepository) {}

  async findByFilter(props: FindByFilterProps): Promise<{
    data: Movement[];
    count: number;
    hasMore: boolean;
  }> {
    return this.movementRepository.findByFilter(props);
  }

  async find(userId: string, id: string): Promise<Movement | null> {
    const foundMovement = await this.movementRepository.find({
      id,
      userId,
    });

    if (!foundMovement) {
      throw new HttpError(404, 'Movement not found');
    }

    return foundMovement;
  }

  async create(userId: string, movement: Movement): Promise<Movement> {
    return this.movementRepository.create(userId, movement);
  }

  async update(userId: string, movement: Movement): Promise<Movement> {
    const foundMovement = await this.movementRepository.find({
      id: movement.id,
      userId,
    });

    if (!foundMovement) {
      throw new HttpError(404, 'Movement not found');
    }

    return this.movementRepository.update(movement.id, movement);
  }

  async delete(userId: string, id: string): Promise<Movement> {
    const foundMovement = await this.movementRepository.find({
      id,
      userId,
    });

    if (!foundMovement) {
      throw new HttpError(404, 'Movement not found');
    }

    return this.movementRepository.delete(id);
  }
}

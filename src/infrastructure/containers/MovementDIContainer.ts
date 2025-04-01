import { MovementUseCases } from '../../use-cases/MovementUseCases';
import { PrismaMovementRepository } from '../repositories/PrismaMovementRepository';

class MovementDIContainer {
  private static _movementRepository = new PrismaMovementRepository();

  static getUseCases() {
    return new MovementUseCases(this._movementRepository);
  }

  static getRepository() {
    return this._movementRepository;
  }
}

export default MovementDIContainer;

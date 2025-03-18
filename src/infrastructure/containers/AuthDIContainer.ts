import { AuthUseCases } from '../../use-cases/AuthUseCases';
import { ArgonRepository } from '../repositories/ArgonRepository';
import { JWTRepository } from '../repositories/JWTRepository';
import { UserDIContainer } from './UserDIContainer';

class AuthDIContainer {
  private static _authRepository = new JWTRepository();
  private static _userRepository = UserDIContainer.getRepository();
  private static hashRepository = new ArgonRepository();

  static getUseCases() {
    return new AuthUseCases(
      this._authRepository,
      this._userRepository,
      this.hashRepository,
    );
  }

  static getRepository() {
    return this._authRepository;
  }
}

export { AuthDIContainer };

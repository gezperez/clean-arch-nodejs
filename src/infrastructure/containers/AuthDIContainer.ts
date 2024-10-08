import { AuthUseCases } from '../../use-cases/AuthUseCases';
import { ArgonRepository } from '../repositories/ArgonRepository';
import { JWTRepository } from '../repositories/JWTRepository';
import { UserDIContainer } from './UserDIContainer';

class AuthDIContainer {
  private static _authRepository = new JWTRepository();
  private static _userRepository = UserDIContainer.getRepository();
  private static hashRepository = new ArgonRepository();

  static getAuthUseCases() {
    return new AuthUseCases(
      this._authRepository,
      this._userRepository,
      this.hashRepository,
    );
  }
}

export { AuthDIContainer };

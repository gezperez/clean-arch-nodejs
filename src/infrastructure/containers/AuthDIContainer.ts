import { AuthUseCases } from '../../use-cases/AuthUseCases';
import { JWTRepository } from '../repositories/JWTRepository';
import { UserDIContainer } from './UserDIContainer';

class AuthDIContainer {
  private static _authRepository = new JWTRepository();
  private static _userRepository = UserDIContainer.getUserRepository();

  static getAuthUseCases() {
    return new AuthUseCases(this._authRepository, this._userRepository);
  }
}

export { AuthDIContainer };

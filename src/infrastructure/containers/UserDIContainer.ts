import { UserUseCases } from '../../use-cases/UserUseCases';
import { MongoUserRepository } from '../repositories/user/MongoRepository';
import { PrismaUserRepository } from '../repositories/user/PrismaRepository';

const useMongo = process.env.DB_TYPE === 'mongo';

class UserDIContainer {
  private static _userRepository = useMongo
    ? new MongoUserRepository()
    : new PrismaUserRepository();

  static getUserUseCases() {
    return new UserUseCases(this._userRepository);
  }
}

export { UserDIContainer };

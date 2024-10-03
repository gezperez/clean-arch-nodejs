import { UserUseCases } from '../../use-cases/UserUseCases';
import { ArgonRepository } from '../repositories/hash/ArgonRepository';
import { MongoUserRepository } from '../repositories/user/MongoRepository';
import { PrismaUserRepository } from '../repositories/user/PrismaRepository';

const useMongo = process.env.DB_TYPE === 'mongo';

class UserDIContainer {
  private static _userRepository = useMongo
    ? new MongoUserRepository()
    : new PrismaUserRepository();

  private static _hashRepository = new ArgonRepository();

  static getUserUseCases() {
    return new UserUseCases(this._userRepository, this._hashRepository);
  }
}

export { UserDIContainer };

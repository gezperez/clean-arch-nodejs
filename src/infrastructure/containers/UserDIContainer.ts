import { UserUseCases } from '../../use-cases/UserUseCases';
import { ArgonRepository } from '../repositories/ArgonRepository';
import { MongoUserRepository } from '../repositories/MongoUserRepository';
import { PrismaUserRepository } from '../repositories/PrismaUserRepository';

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

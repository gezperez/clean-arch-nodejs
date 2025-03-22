import { IncomeUseCases } from '../../use-cases/IncomeUseCases';
import { MongoIncomeRepository } from '../repositories/MongoIncomeRepository';
import { PrismaIncomeRepository } from '../repositories/PrismaIncomeRepository';

const useMongo = process.env.DB_TYPE === 'mongo';

class IncomeDIContainer {
  private static _incomeRepository = useMongo
    ? new MongoIncomeRepository()
    : new PrismaIncomeRepository();

  static getUseCases() {
    return new IncomeUseCases(this._incomeRepository);
  }

  static getRepository() {
    return this._incomeRepository;
  }
}

export { IncomeDIContainer };

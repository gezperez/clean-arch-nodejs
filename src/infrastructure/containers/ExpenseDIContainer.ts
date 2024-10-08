import { ExpenseUseCases } from '../../use-cases/ExpenseUseCases';
import { MongoExpenseRepository } from '../repositories/MongoExpenseRepository';
import { PrismaExpenseRepository } from '../repositories/PrismaExpenseRepository';

const useMongo = process.env.DB_TYPE === 'mongo';

class ExpenseDIContainer {
  private static _expenseRepository = useMongo
    ? new MongoExpenseRepository()
    : new PrismaExpenseRepository();

  static getUseCases() {
    return new ExpenseUseCases(this._expenseRepository);
  }

  static getRepository() {
    return this._expenseRepository;
  }
}

export { ExpenseDIContainer };

import { CategoryUseCases } from '../../use-cases/CategoryUseCases';
import { MongoCategoryRepository } from '../repositories/MongoCategoryRepository';
import { PrismaCategoryRepository } from '../repositories/PrismaCategoryRepository';

const useMongo = process.env.DB_TYPE === 'mongo';

class CategoryDIContainer {
  private static _categoryRepository = useMongo
    ? new MongoCategoryRepository()
    : new PrismaCategoryRepository();

  static getUseCases() {
    return new CategoryUseCases(this._categoryRepository);
  }

  static getRepository() {
    return this._categoryRepository;
  }
}

export { CategoryDIContainer };

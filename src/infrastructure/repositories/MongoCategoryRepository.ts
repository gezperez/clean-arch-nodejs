import { Category } from '../../domain/entities/Category';

import { CategoryModel } from '../models/CategoryModel';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';

export class MongoCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return CategoryModel.find();
  }

  findById(id: string): Promise<Category | null> {
    return CategoryModel.findById(id);
  }

  create(category: Category): Promise<Category> {
    const newCategory = new CategoryModel(category);
    return newCategory.save();
  }

  update(id: string, category: Category): Promise<Category> {
    return CategoryModel.findByIdAndUpdate(id, category, { new: true });
  }

  delete(id: string): Promise<Category> {
    return CategoryModel.findByIdAndDelete(id);
  }
}

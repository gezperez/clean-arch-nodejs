import { Category } from '../domain/entities/Category';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';
import { HttpError } from '../interface/middleware/error';

export class CategoryUseCases {
  constructor(private categoryRepository: ICategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.categoryRepository.findById(id);

    if (!category) {
      throw new HttpError(404, 'Category not found');
    }

    return category;
  }

  async create(category: Category): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  async update(id: string, category: Category): Promise<Category | null> {
    const foundCategory = await this.categoryRepository.findById(id);

    if (!foundCategory) {
      throw new HttpError(404, 'Category not found');
    }

    return this.categoryRepository.update(id, category);
  }

  async delete(id: string): Promise<Category> {
    return this.categoryRepository.delete(id);
  }
}

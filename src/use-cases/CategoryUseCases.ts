import { Category } from '../domain/entities/Category';
import { ICategoryRepository } from '../domain/interfaces/ICategoryRepository';

export class CategoryUseCases {
  constructor(private categoryRepository: ICategoryRepository) {}

  async findAll(): Promise<Category[]> {
    return this.categoryRepository.findAll();
  }

  async findById(id: string): Promise<Category | null> {
    return this.categoryRepository.findById(id);
  }

  async create(category: Category): Promise<Category> {
    return this.categoryRepository.create(category);
  }

  async update(id: string, category: Category): Promise<Category | null> {
    return this.categoryRepository.update(id, category);
  }

  async delete(id: string): Promise<Category> {
    return this.categoryRepository.delete(id);
  }
}

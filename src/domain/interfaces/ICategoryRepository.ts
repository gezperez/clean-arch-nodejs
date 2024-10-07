import { Category } from '../entities/Category';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(expenseId: string): Promise<Category | null>;
  create(category: Category): Promise<Category>;
  update(id: string, category: Category): Promise<Category>;
  delete(id: string): Promise<Category>;
}

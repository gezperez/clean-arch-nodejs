import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import prisma from '../models/PrismaClient';

export class PrismaCategoryRepository implements ICategoryRepository {
  findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  create(category: Category): Promise<Category> {
    return prisma.category.create({
      data: category,
    });
  }

  update(id: string, category: Category): Promise<Category | null> {
    return prisma.category.update({
      where: { id },
      data: category,
    });
  }
  delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}

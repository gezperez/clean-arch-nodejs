import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import { prisma } from '../database/Prisma';

export class PrismaCategoryRepository implements ICategoryRepository {
  async findAll(): Promise<Category[]> {
    return prisma.category.findMany();
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async create(category: Category): Promise<Category> {
    return prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        iconName: category.iconName,
        color: category.color,
        updatedAt: new Date(),
      },
    });
  }

  async update(id: string, category: Category): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: {
        name: category.name,
        iconName: category.iconName,
        color: category.color,
        updatedAt: new Date(),
      },
    });
  }

  async delete(id: string): Promise<Category> {
    return prisma.category.delete({
      where: { id },
    });
  }
}

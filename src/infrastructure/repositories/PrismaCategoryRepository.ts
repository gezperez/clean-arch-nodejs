import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';
import { prisma } from '../database/Prisma';
import { v4 as uuidv4 } from 'uuid';
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
        id: uuidv4(),
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

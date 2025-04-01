import { Prisma } from '@prisma/client';
import { Movement } from '../../domain/entities/Movement';
import {
  FindByFilterProps,
  IMovementRepository,
} from '../../domain/interfaces/IMovementRepository';
import { prisma } from '../database/Prisma';
import { v4 as uuidv4 } from 'uuid';

export class PrismaMovementRepository implements IMovementRepository {
  async findByFilter({
    userId,
    limit = 10,
    cursor = null,
    searchString,
    type,
  }: FindByFilterProps): Promise<{
    data: Movement[];
    count: number;
    hasMore: boolean;
  }> {
    const where = {
      userId,
      ...(type && { type }),
      ...(searchString && {
        OR: [
          {
            name: {
              contains: searchString,
              mode: Prisma.QueryMode.insensitive,
            },
          },
          {
            description: {
              contains: searchString,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const movements = await prisma.movement.findMany({
      where,
      take: limit + 1,
      cursor: cursor ? { id: cursor } : undefined,
      skip: cursor ? 1 : 0,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: true,
      },
    });

    const count = await prisma.movement.count({ where });

    const hasMore = movements.length > limit;
    const data = hasMore ? movements.slice(0, -1) : movements;

    return {
      data,
      count,
      hasMore,
    };
  }

  async find(where: Prisma.MovementWhereUniqueInput): Promise<Movement | null> {
    return prisma.movement.findUnique({
      where,
      include: {
        category: true,
      },
    });
  }

  async create(userId: string, movement: Movement): Promise<Movement> {
    const data: Prisma.MovementCreateInput = {
      id: uuidv4(),
      user: { connect: { id: movement.userId } },
      category: { connect: { id: movement.categoryId } },
      name: movement.name,
      amount: movement.amount,
      createdAt: movement.createdAt ?? new Date(),
      updatedAt: new Date(),
      currency: movement.currency,
      recurrence: movement.recurrence,
      description: movement.description ?? '',
      type: movement.type,
    };

    return prisma.movement.create({
      data,
      include: {
        category: true,
      },
    });
  }

  async update(id: string, movement: Movement): Promise<Movement> {
    const data = {
      name: movement.name,
      amount: movement.amount,
      createdAt: movement.createdAt ?? new Date(),
      updatedAt: new Date(),
      currency: movement.currency,
      recurrence: movement.recurrence,
      description: movement.description ?? '',
      type: movement.type,
    };

    return prisma.movement.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });
  }

  async delete(id: string): Promise<Movement> {
    return prisma.movement.delete({
      where: { id },
      include: {
        category: true,
      },
    });
  }
}

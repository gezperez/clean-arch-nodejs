import { Prisma } from '@prisma/client';
import { Movement } from '../entities/Movement';

export interface FindByFilterProps {
  userId: string;
  cursor?: string | null;
  limit?: number;
  searchString?: string;
  type?: 'EXPENSE' | 'INCOME';
}

export interface IMovementRepository {
  findByFilter({
    userId,
    cursor,
    limit,
    searchString,
    type,
  }: FindByFilterProps): Promise<{
    data: Movement[];
    count: number;
    hasMore: boolean;
  }>;
  find(where: Prisma.MovementWhereInput): Promise<Movement | null>;
  create(userId: string, movement: Movement): Promise<Movement>;
  update(id: string, movement: Movement): Promise<Movement>;
  delete(id: string): Promise<Movement>;
}

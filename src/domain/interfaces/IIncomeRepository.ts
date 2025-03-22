import { Income } from '../entities/Income';

export interface FindByFilterProps {
  userId: string;
  cursor?: string | null;
  limit?: number;
  searchString?: string;
}

export interface IIncomeRepository {
  findByFilter({
    userId,
    cursor,
    limit,
    searchString,
  }: FindByFilterProps): Promise<{
    data: Income[];
    count: number;
    hasMore: boolean;
  }>;
  findById(incomeId: string): Promise<Income | null>;
  create(userId: string, income: Income): Promise<Income>;
  update(incomeId: string, income: Income): Promise<Income>;
  delete(incomeId: string): Promise<Income>;
}

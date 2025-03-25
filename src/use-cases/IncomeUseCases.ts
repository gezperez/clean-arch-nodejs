import { Income } from '../domain/entities/Income';
import {
  FindByFilterProps,
  IIncomeRepository,
} from '../domain/interfaces/IIncomeRepository';
import { HttpError } from '../interface/middleware/error';

export class IncomeUseCases {
  constructor(private incomeRepository: IIncomeRepository) {}

  async findByFilter(props: FindByFilterProps): Promise<{
    data: Income[];
    count: number;
    hasMore: boolean;
  }> {
    return this.incomeRepository.findByFilter(props);
  }

  async find(userId: string, id: string): Promise<Income | null> {
    const foundIncome = await this.incomeRepository.find({
      where: { id, userId },
    });

    if (!foundIncome) {
      throw new HttpError(404, 'Income not found');
    }

    return foundIncome;
  }

  async create(userId: string, income: Income): Promise<Income> {
    return this.incomeRepository.create(userId, income);
  }

  async update(userId: string, income: Income): Promise<Income> {
    const foundIncome = await this.incomeRepository.find({
      where: { id: income.id, userId },
    });

    if (!foundIncome) {
      throw new HttpError(404, 'Income not found');
    }

    return this.incomeRepository.update(income.id, income);
  }

  async delete(id: string): Promise<Income> {
    return this.incomeRepository.delete(id);
  }
}

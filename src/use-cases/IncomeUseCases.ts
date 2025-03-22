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

  async findById(id: string): Promise<Income | null> {
    const foundIncome = await this.incomeRepository.findById(id);

    if (!foundIncome) {
      throw new HttpError(404, 'Income not found');
    }

    return foundIncome;
  }

  async create(userId: string, income: Income): Promise<Income> {
    return this.incomeRepository.create(userId, income);
  }

  async update(id: string, income: Income): Promise<Income> {
    const foundIncome = await this.incomeRepository.findById(id);

    if (!foundIncome) {
      throw new HttpError(404, 'Income not found');
    }

    return this.incomeRepository.update(id, income);
  }

  async delete(id: string): Promise<Income> {
    return this.incomeRepository.delete(id);
  }
}

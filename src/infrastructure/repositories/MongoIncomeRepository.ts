import mongoose from 'mongoose';
import {
  FindByFilterProps,
  IIncomeRepository,
} from '../../domain/interfaces/IIncomeRepository';
import { IncomeModel } from '../models/IncomeModel';
import { Income } from '../../domain/entities/Income';

export class MongoIncomeRepository implements IIncomeRepository {
  async findByFilter({
    userId,
    cursor,
    limit,
    searchString,
  }: FindByFilterProps): Promise<{
    data: Income[];
    count: number;
    hasMore: boolean;
  }> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: any = {
      userId: new mongoose.Types.ObjectId(userId),
    };

    if (searchString) {
      query.$or = [
        { name: { $regex: searchString, $options: 'i' } },
        { amount: Number(searchString) },
      ];
    }

    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const data = await IncomeModel.find(query)
      .sort({ date: -1 })
      .limit(limit + 1);

    const count = await IncomeModel.countDocuments(query);

    const hasMore = data.length > limit;
    const paginatedData = hasMore ? data.slice(0, -1) : data;

    return { data: paginatedData, count, hasMore };
  }

  async find({
    where: { id, userId },
  }: {
    where: { id: string; userId: string };
  }): Promise<Income | null> {
    return IncomeModel.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async create(userId: string, income: Income): Promise<Income> {
    return IncomeModel.create({
      ...income,
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async update(incomeId: string, income: Income): Promise<Income> {
    return IncomeModel.findByIdAndUpdate(incomeId, income, { new: true });
  }

  async delete(incomeId: string): Promise<Income> {
    return IncomeModel.findByIdAndDelete(incomeId);
  }
}

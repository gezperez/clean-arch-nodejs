import mongoose from 'mongoose';
import { Expense } from '../../domain/entities/Expense';
import {
  FindByFilterProps,
  IExpenseRepository,
} from '../../domain/interfaces/IExpenseRepository';
import { ExpenseModel } from '../models/ExpenseModel';

export class MongoExpenseRepository implements IExpenseRepository {
  async findByFilter({
    userId,
    cursor,
    limit,
    searchString,
  }: FindByFilterProps): Promise<{
    data: Expense[];
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
        { description: { $regex: searchString, $options: 'i' } },
        { categoryName: { $regex: searchString, $options: 'i' } },
        { amount: Number(searchString) },
      ];
    }

    if (cursor) {
      query._id = { $lt: new mongoose.Types.ObjectId(cursor) };
    }

    const data = await ExpenseModel.find(query)
      .sort({ creationDate: -1 })
      .limit(limit + 1);

    const count = await ExpenseModel.countDocuments(query);

    const hasMore = data.length > limit;
    const paginatedData = hasMore ? data.slice(0, -1) : data;

    return {
      data: paginatedData,
      count,
      hasMore,
    };
  }

  findById(id: string): Promise<Expense | null> {
    return ExpenseModel.findById(id);
  }
  create(userId: string, expense: Expense): Promise<Expense> {
    const newExpense = new ExpenseModel({ ...expense, userId });
    return newExpense.save();
  }
  update(expenseId: string, expense: Expense): Promise<Expense> {
    return ExpenseModel.findByIdAndUpdate(expenseId, expense, { new: true });
  }
  delete(id: string): Promise<Expense> {
    return ExpenseModel.findByIdAndDelete(id);
  }
}

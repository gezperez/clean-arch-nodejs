import mongoose from 'mongoose';
import { Movement } from '../../domain/entities/Movement';
import { IMovementRepository } from '../../domain/interfaces/IMovementRepository';

import { FindByFilterProps } from '../../domain/interfaces/IMovementRepository';
import { MovementModel } from '../models/MovementModel';

export class MongoMovementRepository implements IMovementRepository {
  async findByFilter({
    userId,
    cursor,
    limit,
    searchString,
  }: FindByFilterProps): Promise<{
    data: Movement[];
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

    const data = await MovementModel.find(query)
      .sort({ date: -1 })
      .limit(limit + 1);

    const count = await MovementModel.countDocuments(query);

    const hasMore = data.length > limit;

    return { data: data.slice(0, limit), count, hasMore };
  }

  async find(where: { id: string; userId: string }): Promise<Movement | null> {
    return MovementModel.findOne({
      _id: new mongoose.Types.ObjectId(where.id),
      userId: new mongoose.Types.ObjectId(where.userId),
    });
  }

  async create(userId: string, movement: Movement): Promise<Movement> {
    return MovementModel.create({
      ...movement,
      userId: new mongoose.Types.ObjectId(userId),
    });
  }

  async update(movementId: string, movement: Movement): Promise<Movement> {
    return MovementModel.findByIdAndUpdate(movementId, movement, { new: true });
  }

  async delete(movementId: string): Promise<Movement> {
    return MovementModel.findByIdAndDelete(movementId);
  }
}

import mongoose, { Schema } from 'mongoose';
import { Income } from '../../domain/entities/Income';

const IncomeSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  categoryId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export const IncomeModel = mongoose.model<Income>('Income', IncomeSchema);

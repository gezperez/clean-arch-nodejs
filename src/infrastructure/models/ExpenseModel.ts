import mongoose, { Schema } from 'mongoose';
import { Expense } from '../../domain/entities/Expense';

const ExpenseSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
  categoryId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
});

export const ExpenseModel = mongoose.model<Expense>('Expense', ExpenseSchema);

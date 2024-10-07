import mongoose, { Schema } from 'mongoose';
import { Category } from '../../domain/entities/Category';

const CategorySchema: Schema = new Schema({
  name: { type: String, required: true },
  iconName: { type: String, required: true },
  color: { type: String, required: true },
});

export const CategoryModel = mongoose.model<Category>(
  'Category',
  CategorySchema,
);

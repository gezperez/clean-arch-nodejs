import mongoose, { Schema } from 'mongoose';
import { Movement } from '../../domain/entities/Movement';

const MovementSchema: Schema = new Schema({
  name: { type: String, required: true },
  userId: { type: String, required: true },
});

export const MovementModel = mongoose.model<Movement>(
  'Movement',
  MovementSchema,
);

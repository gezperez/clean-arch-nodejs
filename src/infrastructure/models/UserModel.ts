import mongoose, { Schema } from 'mongoose';
import { User } from '../../domain/entities/User';

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  theme: { type: String, required: true },
  currency: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<User>('User', UserSchema);

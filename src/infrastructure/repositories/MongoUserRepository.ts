import { User } from "@prisma/client";
import { IUserRepository } from "../../domain/interfaces/IUserRepository";
import { UserModel } from "../models/UserModel";

export class MongoUserRepository implements IUserRepository {
  async findAll(): Promise<User[]> {
    return UserModel.find();
  }

  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id);
  }

  async findByEmail(email: string): Promise<User | null> {
    return UserModel.findOne({ email });
  }

  async create(user: User): Promise<User> {
    const newUser = new UserModel(user);
    return newUser.save();
  }

  async update(id: string, user: User): Promise<User | null> {
    return UserModel.findByIdAndUpdate(id, user, { new: true });
  }

  async delete(id: string): Promise<User> {
    return UserModel.findByIdAndDelete(id);
  }
}

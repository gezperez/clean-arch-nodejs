import mongoose from 'mongoose';

export class MongoConnection {
  async connect(): Promise<void> {
    try {
      await mongoose.connect(process.env.MONGO_URI as string);
      console.log('MongoDB connected');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      process.exit(1);
    }
  }
}

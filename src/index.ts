import express from 'express';
import dotenv from 'dotenv';
import 'reflect-metadata';

import { userRoutes } from './interface/routes/userRoutes';
import { MongoConnection } from './infrastructure/database/MongoDB';
import { setupSwagger } from './interface/middleware/swagger';
import { authRoutes } from './interface/routes/authRoutes';
import { aiRoutes } from './interface/routes/aiRoutes';
import { expenseRoutes } from './interface/routes/expenseRoutes';
dotenv.config();

const app = express();
const API_PORT = process.env.API_PORT;

const useMongo = process.env.DB_TYPE === 'mongo';

if (useMongo) {
  const dbConnection = new MongoConnection();

  dbConnection.connect();
}

app.use(express.json());

setupSwagger(app);

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', aiRoutes);
app.use('/api', expenseRoutes);

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

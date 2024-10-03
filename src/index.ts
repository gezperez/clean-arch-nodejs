import express from 'express';
import dotenv from 'dotenv';
import { userRoutes } from './interface/routes/userRoutes';
import { MongoConnection } from './infrastructure/database/MongoDB';
import { setupSwagger } from './interface/middleware/swagger';
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

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

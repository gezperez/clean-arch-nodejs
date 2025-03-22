import express from 'express';
import 'reflect-metadata';

import { userRoutes } from './interface/routes/userRoutes';
import { MongoConnection } from './infrastructure/database/MongoDB';
import { setupSwagger } from './interface/middleware/swagger';
import { authRoutes } from './interface/routes/authRoutes';
import { aiRoutes } from './interface/routes/aiRoutes';
import { expenseRoutes } from './interface/routes/expenseRoutes';
import { categoryRoutes } from './interface/routes/categoryRoutes';
import { errorHandler } from './interface/middleware/error';
import { environment } from './interface/middleware/environment';
import { PrismaClient } from '@prisma/client';
import { rateRoutes } from './interface/routes/rateRoutes';
import { incomeRoutes } from './interface/routes/incomeRoutes';

environment.validate();

const app = express();
const API_PORT = environment.port;

const useMongo = environment.dbType === 'mongo';

if (useMongo) {
  const dbConnection = new MongoConnection();

  dbConnection.connect();
} else {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: environment.databaseUrl,
      },
    },
  });

  prisma.$connect();
}

app.use(express.json());

setupSwagger(app);

app.use('/api', userRoutes);
app.use('/api', authRoutes);
app.use('/api', aiRoutes);
app.use('/api', expenseRoutes);
app.use('/api', categoryRoutes);
app.use('/api', rateRoutes);
app.use('/api', incomeRoutes);

app.use(errorHandler);

app.listen(API_PORT, () => {
  console.log(`Server is running on port ${API_PORT}`);
});

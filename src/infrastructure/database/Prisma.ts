import { PrismaClient } from '@prisma/client';
import { environment } from '../../interface/middleware/environment';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: environment.databaseUrl,
    },
  },
});

export { prisma };

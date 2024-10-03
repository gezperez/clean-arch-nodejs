import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node JS API',
      version: '1.0.0',
    },
    servers: [
      {
        url: '/api',
        description: 'API Base URL',
      },
    ],
  },
  apis: ['./src/interface/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

export { setupSwagger };

import { Router } from 'express';
import { RateController } from '../controllers/RateController';
import { RateDIContainer } from '../../infrastructure/containers/RateDIContainer';

const router = Router();

const rateUseCases = RateDIContainer.getUseCases();

const rateController = new RateController(rateUseCases);

/**
 * @swagger
 * /rates:
 *   get:
 *     summary: Get all rates
 *     description: Retrieve a list of all rates from the database.
 */
router.get('/rates', (req, res, next) =>
  rateController.getRates(req, res, next),
);

export { router as rateRoutes };

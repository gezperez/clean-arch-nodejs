import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { SummaryController } from '../controllers/SummaryController';
import { SummaryDIContainer } from '../../infrastructure/containers/SummaryDIContainer';
import { AuthenticatedRequest } from '../../types/request';

const router = Router();
const summaryUseCases = SummaryDIContainer.getUseCases();
const summaryController = new SummaryController(summaryUseCases);

router.post('/summary/statistics', authenticateToken, (req, res, next) =>
  summaryController.getStatistics(req as AuthenticatedRequest, res, next),
);

router.post('/summary/daily-statistics', authenticateToken, (req, res, next) =>
  summaryController.getDailyStatistics(req as AuthenticatedRequest, res, next),
);

export { router as summaryRoutes };

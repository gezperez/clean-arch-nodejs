import { Router } from 'express';
import { IncomeDIContainer } from '../../infrastructure/containers/IncomeDIContainer';
import {
  AuthenticatedRequest,
  IncomeController,
} from '../controllers/IncomeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const incomeUseCases = IncomeDIContainer.getUseCases();

const incomeController = new IncomeController(incomeUseCases);

router.post('/incomes', authenticateToken, (req, res, next) =>
  incomeController.findByFilter(req as AuthenticatedRequest, res, next),
);
router.get('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.find(req as AuthenticatedRequest, res, next),
);
router.post('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.create(req as AuthenticatedRequest, res, next),
);
router.put('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.update(req as AuthenticatedRequest, res, next),
);
router.delete('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.delete(req as AuthenticatedRequest, res, next),
);

export { router as incomeRoutes };

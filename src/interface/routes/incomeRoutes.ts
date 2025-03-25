import { Router } from 'express';
import { IncomeDIContainer } from '../../infrastructure/containers/IncomeDIContainer';
import { IncomeController } from '../controllers/IncomeController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const incomeUseCases = IncomeDIContainer.getUseCases();

const incomeController = new IncomeController(incomeUseCases);

router.post('/incomes', authenticateToken, (req, res, next) =>
  incomeController.findByFilter(req, res, next),
);
router.get('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.findById(req, res, next),
);
router.post('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.create(req, res, next),
);
router.put('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.update(req, res, next),
);
router.delete('/incomes/:id', authenticateToken, (req, res, next) =>
  incomeController.delete(req, res, next),
);

export { router as incomeRoutes };

import { Router } from 'express';
import { IncomeDIContainer } from '../../infrastructure/containers/IncomeDIContainer';
import { IncomeController } from '../controllers/IncomeController';

const router = Router();

const incomeUseCases = IncomeDIContainer.getUseCases();

const incomeController = new IncomeController(incomeUseCases);

router.get('/incomes', incomeController.findByFilter);
router.get('/incomes/:id', incomeController.findById);
router.post('/incomes', incomeController.create);
router.put('/incomes/:id', incomeController.update);
router.delete('/incomes/:id', incomeController.delete);

export { router as incomeRoutes };

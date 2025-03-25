import { Router } from 'express';
import { ExpenseDIContainer } from '../../infrastructure/containers/ExpenseDIContainer';
import { ExpenseController } from '../controllers/ExpenseController';
import { authenticateToken } from '../middleware/auth';
import { AIIContainer } from '../../infrastructure/containers/AIDIContainer';

const router = Router();

const expenseUseCases = ExpenseDIContainer.getUseCases();

const aiUseCases = AIIContainer.getUseCases();

const expenseController = new ExpenseController(expenseUseCases, aiUseCases);

/**
 * @swagger
 * /expenses:
 *   get:
 *     summary: Get a list of expenses
 *     description: Retrieve a list of expenses from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of expenses.
 */
router.post('/expenses', authenticateToken, (req, res, next) =>
  expenseController.findByFilter(req, res, next),
);

router.get('/expenses/:id', authenticateToken, (req, res, next) =>
  expenseController.findById(req, res, next),
);

router.post('/expenses/:id', authenticateToken, (req, res, next) =>
  expenseController.create(req, res, next),
);

router.post('/expenses/ai/:id', authenticateToken, (req, res, next) =>
  expenseController.createWithAI(req, res, next),
);

router.patch('/expenses/:id', authenticateToken, (req, res, next) =>
  expenseController.update(req, res, next),
);

router.delete('/expenses/:id', authenticateToken, (req, res, next) =>
  expenseController.delete(req, res, next),
);

export { router as expenseRoutes };

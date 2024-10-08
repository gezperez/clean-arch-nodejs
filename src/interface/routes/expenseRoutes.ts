import { Router } from 'express';
import { ExpenseDIContainer } from '../../infrastructure/containers/ExpenseDIContainer';
import { ExpenseController } from '../controllers/ExpenseController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

const expenseUseCases = ExpenseDIContainer.getExpenseUseCases();

const expenseController = new ExpenseController(expenseUseCases);

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
router.get('/expenses', authenticateToken, (req, res) =>
  expenseController.getByFilter(req, res),
);

router.get('/expenses/:id', authenticateToken, (req, res) =>
  expenseController.getById(req, res),
);

router.post('/expenses/:id', authenticateToken, (req, res) =>
  expenseController.create(req, res),
);

router.patch('/expenses/:id', authenticateToken, (req, res) =>
  expenseController.update(req, res),
);

router.delete('/expenses/:id', authenticateToken, (req, res) =>
  expenseController.delete(req, res),
);

export { router as expenseRoutes };

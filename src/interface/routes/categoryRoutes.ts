import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { CategoryDIContainer } from '../../infrastructure/containers/CategoryDIContainer';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();

const categoryUseCases = CategoryDIContainer.getCategoryUseCases();

const categoryController = new CategoryController(categoryUseCases);

/**
 * @swagger
 * /category:
 *   get:
 *     summary: Get a list of categories
 *     description: Retrieve a list of categories from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of categories.
 */
router.get('/category', authenticateToken, (req, res) =>
  categoryController.getAll(req, res),
);

router.get('/category/:id', authenticateToken, (req, res) =>
  categoryController.getById(req, res),
);

router.post('/category', authenticateToken, (req, res) =>
  categoryController.create(req, res),
);

router.patch('/category/:id', authenticateToken, (req, res) =>
  categoryController.update(req, res),
);

router.delete('/category/:id', authenticateToken, (req, res) =>
  categoryController.delete(req, res),
);

export { router as categoryRoutes };

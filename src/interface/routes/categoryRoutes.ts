import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { CategoryDIContainer } from '../../infrastructure/containers/CategoryDIContainer';
import { CategoryController } from '../controllers/CategoryController';

const router = Router();

const categoryUseCases = CategoryDIContainer.getUseCases();

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
router.get('/category', authenticateToken, (req, res, next) =>
  categoryController.findAll(req, res, next),
);

router.get('/category/:id', authenticateToken, (req, res, next) =>
  categoryController.findById(req, res, next),
);

router.post('/category', authenticateToken, (req, res, next) =>
  categoryController.create(req, res, next),
);

router.patch('/category/:id', authenticateToken, (req, res, next) =>
  categoryController.update(req, res, next),
);

router.delete('/category/:id', authenticateToken, (req, res, next) =>
  categoryController.delete(req, res, next),
);

export { router as categoryRoutes };

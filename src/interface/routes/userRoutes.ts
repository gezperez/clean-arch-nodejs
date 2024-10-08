import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';
import { UserDIContainer } from '../../infrastructure/containers/UserDIContainer';

const router = Router();

const userUseCases = UserDIContainer.getUseCases();

const userController = new UserController(userUseCases);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of users
 *     description: Retrieve a list of users from the database.
 *     responses:
 *       200:
 *         description: Successful response with a list of users.
 */
router.get('/users', authenticateToken, (req, res, next) =>
  userController.findAll(req, res, next),
);

router.get('/users/:id', authenticateToken, (req, res, next) =>
  userController.findById(req, res, next),
);

router.post('/users', (req, res, next) =>
  userController.create(req, res, next),
);

router.patch('/users/:id', authenticateToken, (req, res, next) =>
  userController.update(req, res, next),
);

router.delete('/users/:id', authenticateToken, (req, res, next) =>
  userController.delete(req, res, next),
);

export { router as userRoutes };

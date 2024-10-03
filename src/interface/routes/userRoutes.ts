import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/auth';
import { UserDIContainer } from '../../infrastructure/containers/UserDIContainer';

const router = Router();

const userUseCases = UserDIContainer.getUserUseCases();

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
router.get('/users', (req, res) => userController.getAll(req, res));

router.get('/users/:id', authenticateToken, (req, res) =>
  userController.getById(req, res),
);

router.post('/users', (req, res) => userController.create(req, res));
router.put('/users/:id', authenticateToken, (req, res) =>
  userController.update(req, res),
);
router.delete('/users/:id', authenticateToken, (req, res) =>
  userController.delete(req, res),
);

export { router as userRoutes };

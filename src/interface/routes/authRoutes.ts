import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { UserDIContainer } from '../../infrastructure/containers/UserDIContainer';
import { ArgonRepository } from '../../infrastructure/repositories/ArgonRepository';
import { AuthDIContainer } from '../../infrastructure/containers/AuthDIContainer';

const router = Router();

const hashRepository = new ArgonRepository();

const authUseCases = AuthDIContainer.getAuthUseCases();

const userUseCases = UserDIContainer.getUserUseCases();

const authController = new AuthController(
  authUseCases,
  hashRepository,
  userUseCases,
);

router.post('/auth', (req, res) => authController.login(req, res));

router.post('/auth/refresh', (req, res) =>
  authController.refreshAccessToken(req, res),
);

export { router as authRoutes };

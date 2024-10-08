import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthDIContainer } from '../../infrastructure/containers/AuthDIContainer';

const router = Router();

const authUseCases = AuthDIContainer.getAuthUseCases();

const authController = new AuthController(authUseCases);

router.post('/auth', (req, res, next) => authController.login(req, res, next));

router.post('/auth/refresh', (req, res, next) =>
  authController.refreshAccessToken(req, res, next),
);

export { router as authRoutes };

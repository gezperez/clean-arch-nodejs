import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthUseCases } from '../../use-cases/AuthUseCases';
import { UserDIContainer } from '../../infrastructure/containers/UserDIContainer';
import { JWTRepository } from '../../infrastructure/repositories/JWTRepository';
import { ArgonRepository } from '../../infrastructure/repositories/ArgonRepository';

const router = Router();

const authRepository = new JWTRepository();

const hashRepository = new ArgonRepository();

const authUseCases = new AuthUseCases(authRepository);

const userUseCases = UserDIContainer.getUserUseCases();

const authController = new AuthController(
  authUseCases,
  hashRepository,
  userUseCases,
);

router.post('/auth', (req, res) => authController.login(req, res));

export { router as authRoutes };

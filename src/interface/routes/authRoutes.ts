import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { AuthUseCases } from '../../use-cases/AuthUserCases';
import { JWTRepository } from '../../infrastructure/repositories/jwt/JWTRepository';
import { ArgonRepository } from '../../infrastructure/repositories/hash/ArgonRepository';
import { UserDIContainer } from '../../infrastructure/containers/UserDIContainer';

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

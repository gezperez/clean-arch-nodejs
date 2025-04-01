import { Router } from 'express';
import MovementDIContainer from '../../infrastructure/containers/MovementDIContainer';
import { MovementController } from '../controllers/MovementController';
import { authenticateToken } from '../middleware/auth';
import { AuthenticatedRequest } from '../../types/request';

const router = Router();

const movementUseCases = MovementDIContainer.getUseCases();

const movementController = new MovementController(movementUseCases);

router.post('/movements', authenticateToken, (req, res, next) =>
  movementController.findByFilter(req as AuthenticatedRequest, res, next),
);

router.get('/movements/:id', authenticateToken, (req, res, next) =>
  movementController.find(req as AuthenticatedRequest, res, next),
);

router.post('/movements/:id', authenticateToken, (req, res, next) =>
  movementController.create(req as AuthenticatedRequest, res, next),
);

router.patch('/movements/:id', authenticateToken, (req, res, next) =>
  movementController.update(req as AuthenticatedRequest, res, next),
);

router.delete('/movements/:id', authenticateToken, (req, res, next) =>
  movementController.delete(req as AuthenticatedRequest, res, next),
);

export default router;

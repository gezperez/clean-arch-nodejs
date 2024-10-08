import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { AIIContainer } from '../../infrastructure/containers/AIDIContainer';

const router = Router();

const aiUseCases = AIIContainer.getUseCases();

const aiController = new AIController(aiUseCases);

router.post('/ai/:id', (req, res, next) =>
  aiController.generatePrompt(req, res, next),
);

export { router as aiRoutes };

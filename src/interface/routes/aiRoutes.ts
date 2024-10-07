import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { GeminiAIRepository } from '../../infrastructure/repositories/GeminiAIRepository';
import { AIUseCases } from '../../use-cases/AIUseCases';

const router = Router();

const aiRepository = new GeminiAIRepository();

const aiUseCases = new AIUseCases(aiRepository);

const aiController = new AIController(aiUseCases);

router.post('/ai', (req, res) => aiController.generatePrompt(req, res));

export { router as aiRoutes };

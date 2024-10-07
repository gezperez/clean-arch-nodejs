import { Router } from 'express';
import { AIController } from '../controllers/AIController';
import { GeminiAIRepository } from '../../infrastructure/repositories/GeminiAIRepository';
import { AIUseCases } from '../../use-cases/AIUseCases';
import { ExpenseDIContainer } from '../../infrastructure/containers/ExpenseDIContainer';

const router = Router();

const aiRepository = new GeminiAIRepository();

const expenseUseCases = ExpenseDIContainer.getExpenseUseCases();

const aiUseCases = new AIUseCases(aiRepository, expenseUseCases);

const aiController = new AIController(aiUseCases);

router.post('/ai/:id', (req, res) => aiController.generatePrompt(req, res));

export { router as aiRoutes };

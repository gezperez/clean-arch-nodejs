import axios from 'axios';
import { IAIRepository } from '../../domain/interfaces/IAIRepository';
import { Expense } from '../../domain/entities/Expense';

const AI_API_KEY = process.env.GEMINI_API_KEY;
const AI_URL = `${process.env.GEMINI_URL}${AI_API_KEY}`;

export class GeminiAIRepository implements IAIRepository {
  generatePrompt(question: string, data: Expense[]): Promise<string> {
    const expenseData = data
      .map(
        (e: Expense) =>
          `${e.name}: $${e.amount} on ${e.date} in ${e.categoryId}`,
      )
      .join(', ');

    const fullPrompt = `The user has the following expenses: ${expenseData}

    You are an expenses tracking mobile app.
    
    Be able to return data based on questions the user asks about his expenses.

    Be concise

    `;

    return axios.post(AI_URL, {
      contents: [{ parts: [{ text: fullPrompt }] }],
    });
  }
}

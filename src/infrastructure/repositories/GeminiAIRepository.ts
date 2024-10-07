import axios from 'axios';
import { IAIRepository } from '../../domain/interfaces/IAIRepository';
import { Expense } from '../../domain/entities/Expense';

const AI_API_KEY = process.env.GEMINI_API_KEY;
const AI_URL = `${process.env.GEMINI_URL}${AI_API_KEY}`;

const basePrompt = `You are an expense manager AI. The user will input natural language sentences related to expenses. 
    Your job is to extract the key data fields:
    - Amount (numeric)
    - Category (like groceries, food, rent, etc.)
    - Date (if specified)

    **Return the extracted data as a JSON string.**

    Example Input: "I spent $30 on groceries yesterday."

    Example Output as string: '{"amount": 30, "category": "groceries", "date": "2024-09-28"}'`;

const expenses = [
  {
    id: '1',
    name: 'Groceries',
    amount: 100,
    category: 'Food',
    date: '2024-10-01',
  },
  {
    id: '2',
    name: 'Gym Membership',
    amount: 50,
    category: 'Health',
    date: '2024-10-01',
  },
];

const generatePrompt = (question, expenses) => {
  const expenseData = expenses
    .map(
      (e: Expense) => `${e.name}: $${e.amount} on ${e.date} in ${e.categoryId}`,
    )
    .join(', ');
  return `${basePrompt} The user has the following expenses: ${expenseData}. ${question}`;
};

export class GeminiAIRepository implements IAIRepository {
  generatePrompt(question: string, data: Expense[]): Promise<string> {
    const fullPrompt = generatePrompt(question, expenses);

    return axios.post(AI_URL, {
      contents: [{ parts: [{ text: fullPrompt }] }],
    });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { Expense } from '../../domain/entities/Expense';
import { IAIService } from '../../domain/interfaces/IAIService';
import { Category } from '../../domain/entities/Category';

interface AIExpenseResponse {
  amount: number;
  category: string;
  name: string;
  date: string;
  currency?: string;
}

export class GeminiService implements IAIService {
  private readonly genAI: GoogleGenerativeAI;
  private static readonly MODEL_NAME = 'gemini-2.0-flash';
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 1000; // ms

  constructor(apiKey?: string) {
    const key = apiKey || process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error('Gemini API key is required');
    }
    this.genAI = new GoogleGenerativeAI(key);
  }

  private buildPrompt(message: string, categories: Category[]): string {
    return `You are a financial assistant. Please analyze this expense message and extract the following information in JSON format:
      {
        "amount": (number without currency symbols),
        "category": (one of: ${categories.map((category) => category.name).join(', ')}),
        "name": (clear name of the expense),
        "date": (ISO date string, use current date if not specified),
        "currency": (currency of the expense, use USD if not specified),
        "recurrence": (recurrence of the expense, use "None" if not specified),
        "description": (description of the expense, use empty string if not specified)
      }

      Message: "${message.trim()}"

      Return only valid JSON, no additional text.`;
  }

  private async retryWithDelay<T>(
    operation: () => Promise<T>,
    retries: number = GeminiService.MAX_RETRIES,
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, GeminiService.RETRY_DELAY),
        );
        return this.retryWithDelay(operation, retries - 1);
      }
      throw error;
    }
  }

  private validateResponse(
    response: AIExpenseResponse,
    categories: Category[],
  ): void {
    if (
      typeof response.amount !== 'number' ||
      isNaN(response.amount) ||
      response.amount <= 0
    ) {
      throw new Error('Invalid amount in AI response');
    }

    if (!response.name || typeof response.name !== 'string') {
      throw new Error('Invalid name in AI response');
    }

    if (!categories.some((category) => category.name === response.category)) {
      throw new Error(`Invalid category: ${response.category}`);
    }

    const date = new Date(response.date);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date format in AI response');
    }
  }

  private parseAIResponse(jsonString: string): AIExpenseResponse {
    try {
      return JSON.parse(jsonString);
    } catch {
      // Try to extract JSON from the text if direct parsing fails
      const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('Failed to parse AI response: Invalid JSON format');
    }
  }

  async createWithAI(
    userId: string,
    message: string,
    categories: Category[],
  ): Promise<Expense> {
    if (!message?.trim()) {
      throw new Error('Message is required');
    }

    if (!categories?.length) {
      throw new Error('Categories are required');
    }

    const model = this.genAI.getGenerativeModel({
      model: GeminiService.MODEL_NAME,
    });
    const prompt = this.buildPrompt(message, categories);

    console.log('Processing expense message:', message);

    const result = await this.retryWithDelay(async () => {
      const response = await model.generateContent(prompt);
      return response.response.text();
    });

    console.log('AI Response:', result);

    const parsedResponse = this.parseAIResponse(result);
    this.validateResponse(parsedResponse, categories);

    const category = categories.find(
      (category) => category.name === parsedResponse.category,
    );

    if (!category) {
      throw new Error(`Category not found: ${parsedResponse.category}`);
    }

    return {
      id: '',
      amount: parsedResponse.amount.toString(),
      categoryId: category.id,
      categoryName: category.name,
      date: new Date(parsedResponse.date),
      userId,
      name: parsedResponse.name.trim(),
      currency: parsedResponse.currency,
      recurrence: 'None',
      description: '',
    };
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GeminiService } from '../GeminiService';
import { Category } from '../../../domain/entities/Category';

// Mock GoogleGenerativeAI
jest.mock('@google/generative-ai');

describe('GeminiService', () => {
  const mockApiKey = 'test-api-key';
  const mockUserId = 'user-123';
  const mockCategories: Category[] = [
    { id: '1', name: 'Groceries', iconName: 'shopping-cart', color: '#4CAF50' },
    { id: '2', name: 'Entertainment', iconName: 'movie', color: '#2196F3' },
  ];

  let service: GeminiService;
  let mockGenerateContent: jest.Mock;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup mock for generateContent
    mockGenerateContent = jest.fn();
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: mockGenerateContent,
      }),
    }));

    // Create service instance
    service = new GeminiService(mockApiKey);
  });

  describe('constructor', () => {
    it('should create instance with provided API key', () => {
      const service = new GeminiService(mockApiKey);
      expect(service).toBeInstanceOf(GeminiService);
      expect(GoogleGenerativeAI).toHaveBeenCalledWith(mockApiKey);
    });

    it('should create instance with environment API key', () => {
      process.env.GEMINI_API_KEY = 'env-api-key';
      const service = new GeminiService();
      expect(service).toBeInstanceOf(GeminiService);
      expect(GoogleGenerativeAI).toHaveBeenCalledWith('env-api-key');
      delete process.env.GEMINI_API_KEY;
    });

    it('should throw error if no API key is provided', () => {
      delete process.env.GEMINI_API_KEY;
      expect(() => new GeminiService()).toThrow('Gemini API key is required');
    });
  });

  describe('createWithAI', () => {
    const validResponse = {
      amount: 50.99,
      category: 'Groceries',
      name: 'Weekly groceries',
      date: '2024-03-20T10:00:00Z',
    };

    beforeEach(() => {
      // Setup default successful response
      mockGenerateContent.mockResolvedValue({
        response: { text: () => JSON.stringify(validResponse) },
      });
    });

    it('should successfully create an expense from valid AI response', async () => {
      const message = 'Spent $50.99 on groceries';

      const result = await service.createWithAI(
        mockUserId,
        message,
        mockCategories,
      );

      expect(result).toEqual({
        id: '',
        amount: 50.99,
        categoryId: '1',
        name: 'Weekly groceries',
        date: new Date('2024-03-20T10:00:00Z'),
        userId: mockUserId,
      });
    });

    it('should throw error for empty message', async () => {
      await expect(
        service.createWithAI(mockUserId, '', mockCategories),
      ).rejects.toThrow('Message is required');
    });

    it('should throw error for empty categories', async () => {
      await expect(
        service.createWithAI(mockUserId, 'test message', []),
      ).rejects.toThrow('Categories are required');
    });

    it('should retry on API failure', async () => {
      mockGenerateContent
        .mockRejectedValueOnce(new Error('API Error'))
        .mockRejectedValueOnce(new Error('API Error'))
        .mockResolvedValueOnce({
          response: { text: () => JSON.stringify(validResponse) },
        });

      const result = await service.createWithAI(
        mockUserId,
        'test message',
        mockCategories,
      );

      expect(mockGenerateContent).toHaveBeenCalledTimes(3);
      expect(result).toBeDefined();
    });

    it('should throw error after max retries', async () => {
      mockGenerateContent.mockRejectedValue(new Error('API Error'));

      await expect(
        service.createWithAI(mockUserId, 'test message', mockCategories),
      ).rejects.toThrow('API Error');

      expect(mockGenerateContent).toHaveBeenCalledTimes(4); // Initial + 3 retries
    });

    describe('response validation', () => {
      it('should throw error for invalid amount', async () => {
        mockGenerateContent.mockResolvedValue({
          response: {
            text: () => JSON.stringify({ ...validResponse, amount: 'invalid' }),
          },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Invalid amount in AI response');
      });

      it('should throw error for negative amount', async () => {
        mockGenerateContent.mockResolvedValue({
          response: {
            text: () => JSON.stringify({ ...validResponse, amount: -50 }),
          },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Invalid amount in AI response');
      });

      it('should throw error for invalid category', async () => {
        mockGenerateContent.mockResolvedValue({
          response: {
            text: () =>
              JSON.stringify({ ...validResponse, category: 'InvalidCategory' }),
          },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Invalid category: InvalidCategory');
      });

      it('should throw error for invalid date', async () => {
        mockGenerateContent.mockResolvedValue({
          response: {
            text: () =>
              JSON.stringify({ ...validResponse, date: 'invalid-date' }),
          },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Invalid date format in AI response');
      });

      it('should throw error for missing name', async () => {
        mockGenerateContent.mockResolvedValue({
          response: {
            text: () => JSON.stringify({ ...validResponse, name: '' }),
          },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Invalid name in AI response');
      });
    });

    describe('JSON parsing', () => {
      it('should handle JSON embedded in text', async () => {
        const jsonInText = `Some text before
          ${JSON.stringify(validResponse)}
          Some text after`;

        mockGenerateContent.mockResolvedValue({
          response: { text: () => jsonInText },
        });

        const result = await service.createWithAI(
          mockUserId,
          'test message',
          mockCategories,
        );

        expect(result).toBeDefined();
        expect(result.amount).toBe(50.99);
      });

      it('should throw error for completely invalid JSON', async () => {
        mockGenerateContent.mockResolvedValue({
          response: { text: () => 'Not a JSON at all' },
        });

        await expect(
          service.createWithAI(mockUserId, 'test message', mockCategories),
        ).rejects.toThrow('Failed to parse AI response: Invalid JSON format');
      });
    });
  });
});

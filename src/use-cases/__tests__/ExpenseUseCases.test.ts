import { ExpenseUseCases } from '../ExpenseUseCases';
import { Expense } from '../../domain/entities/Expense';
import {
  IExpenseRepository,
  FindByFilterProps,
} from '../../domain/interfaces/IExpenseRepository';

describe('ExpenseUseCases', () => {
  const mockExpenseRepository = {
    findByFilter: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<IExpenseRepository>;

  let expenseUseCases: ExpenseUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    expenseUseCases = new ExpenseUseCases(mockExpenseRepository);
  });

  const mockExpense: Expense = {
    id: '1',
    amount: '100',
    name: 'Test expense',
    categoryId: 'cat1',
    userId: 'user1',
    date: new Date('2024-03-19'),
    currency: 'USD',
  };

  describe('findByFilter', () => {
    it('should find expenses by filter', async () => {
      const filterProps: FindByFilterProps = {
        userId: 'user1',
        cursor: null,
        limit: 10,
        searchString: '',
      };

      const mockResponse = {
        data: [mockExpense],
        count: 1,
        hasMore: false,
      };

      mockExpenseRepository.findByFilter.mockResolvedValue(mockResponse);

      const result = await expenseUseCases.findByFilter(filterProps);

      expect(result).toEqual(mockResponse);
      expect(mockExpenseRepository.findByFilter).toHaveBeenCalledWith(
        filterProps,
      );
    });
  });

  describe('findById', () => {
    it('should find expense by id', async () => {
      mockExpenseRepository.findById.mockResolvedValue(mockExpense);

      const result = await expenseUseCases.findById('1');

      expect(result).toEqual(mockExpense);
      expect(mockExpenseRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when expense not found', async () => {
      mockExpenseRepository.findById.mockResolvedValue(null);

      await expect(expenseUseCases.findById('1')).rejects.toThrow(
        'Expense not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new expense', async () => {
      const newExpense: Expense = {
        id: '',
        amount: '50',
        name: 'New expense',
        categoryId: 'cat2',
        userId: 'user1',
        date: new Date('2024-03-19'),
        currency: 'USD',
      };

      const createdExpense = { ...newExpense, id: '2' };
      mockExpenseRepository.create.mockResolvedValue(createdExpense);

      const result = await expenseUseCases.create('user1', newExpense);

      expect(result).toEqual(createdExpense);
      expect(mockExpenseRepository.create).toHaveBeenCalledWith(
        'user1',
        newExpense,
      );
    });
  });

  describe('update', () => {
    it('should update expense', async () => {
      const updateData: Expense = {
        ...mockExpense,
        amount: '150',
      };

      mockExpenseRepository.findById.mockResolvedValue(mockExpense);
      mockExpenseRepository.update.mockResolvedValue(updateData);

      const result = await expenseUseCases.update('1', updateData);

      expect(result).toEqual(updateData);
      expect(mockExpenseRepository.findById).toHaveBeenCalledWith('1');
      expect(mockExpenseRepository.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });

    it('should throw error when expense not found', async () => {
      mockExpenseRepository.findById.mockResolvedValue(null);

      await expect(expenseUseCases.update('1', mockExpense)).rejects.toThrow(
        'Expense not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete expense', async () => {
      mockExpenseRepository.delete.mockResolvedValue(mockExpense);

      const result = await expenseUseCases.delete('1');

      expect(result).toEqual(mockExpense);
      expect(mockExpenseRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});

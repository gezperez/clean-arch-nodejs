import { CategoryUseCases } from '../CategoryUseCases';
import { Category } from '../../domain/entities/Category';
import { ICategoryRepository } from '../../domain/interfaces/ICategoryRepository';

describe('CategoryUseCases', () => {
  const mockCategoryRepository = {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  } as unknown as jest.Mocked<ICategoryRepository>;

  let categoryUseCases: CategoryUseCases;

  beforeEach(() => {
    jest.clearAllMocks();
    categoryUseCases = new CategoryUseCases(mockCategoryRepository);
  });

  const mockCategory: Category = {
    id: '1',
    name: 'Food',
    iconName: '🍔',
    color: '#FF0000',
  };

  describe('findAll', () => {
    it('should return all categories', async () => {
      const categories = [mockCategory];
      mockCategoryRepository.findAll.mockResolvedValue(categories);

      const result = await categoryUseCases.findAll();

      expect(result).toEqual(categories);
      expect(mockCategoryRepository.findAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find category by id', async () => {
      mockCategoryRepository.findById.mockResolvedValue(mockCategory);

      const result = await categoryUseCases.findById('1');

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw error when category not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(categoryUseCases.findById('1')).rejects.toThrow(
        'Category not found',
      );
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const newCategory: Category = {
        id: '',
        name: 'Transport',
        iconName: '🚗',
        color: '#00FF00',
      };

      const createdCategory = { ...newCategory, id: '2' };
      mockCategoryRepository.create.mockResolvedValue(createdCategory);

      const result = await categoryUseCases.create(newCategory);

      expect(result).toEqual(createdCategory);
      expect(mockCategoryRepository.create).toHaveBeenCalledWith(newCategory);
    });
  });

  describe('update', () => {
    it('should update category', async () => {
      const updateData: Category = {
        ...mockCategory,
        name: 'Updated Food',
      };

      mockCategoryRepository.findById.mockResolvedValue(mockCategory);
      mockCategoryRepository.update.mockResolvedValue(updateData);

      const result = await categoryUseCases.update('1', updateData);

      expect(result).toEqual(updateData);
      expect(mockCategoryRepository.findById).toHaveBeenCalledWith('1');
      expect(mockCategoryRepository.update).toHaveBeenCalledWith(
        '1',
        updateData,
      );
    });

    it('should throw error when category not found', async () => {
      mockCategoryRepository.findById.mockResolvedValue(null);

      await expect(categoryUseCases.update('1', mockCategory)).rejects.toThrow(
        'Category not found',
      );
    });
  });

  describe('delete', () => {
    it('should delete category', async () => {
      mockCategoryRepository.delete.mockResolvedValue(mockCategory);

      const result = await categoryUseCases.delete('1');

      expect(result).toEqual(mockCategory);
      expect(mockCategoryRepository.delete).toHaveBeenCalledWith('1');
    });
  });
});

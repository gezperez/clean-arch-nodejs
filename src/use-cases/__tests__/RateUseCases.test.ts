import { RateUseCases } from '../RateUseCases';
import { RateService } from '../../infrastructure/services/RateService';
import { ConversionRates } from '../../domain/entities/Currency';

jest.mock('../../infrastructure/services/RateService');

describe('RateUseCases', () => {
  let rateUseCases: RateUseCases;
  let mockRateService: jest.Mocked<RateService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRateService = {
      getRates: jest.fn(),
      getBlueRate: jest.fn(),
      fetchAndUpdateRates: jest.fn(),
    } as unknown as jest.Mocked<RateService>;
    rateUseCases = new RateUseCases(mockRateService);
  });

  describe('getRates', () => {
    it('should get conversion rates', async () => {
      const mockRates: ConversionRates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
      };

      mockRateService.getRates.mockResolvedValue(mockRates);

      const result = await rateUseCases.getRates();

      expect(result).toEqual(mockRates);
      expect(mockRateService.getRates).toHaveBeenCalled();
    });
  });
});

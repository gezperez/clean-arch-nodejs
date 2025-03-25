import axios from 'axios';
import { RateService } from '../RateService';
import { environment } from '../../../interface/middleware/environment';
import {
  BlueRateResponse,
  RatesResponse,
} from '../../../domain/responses/Rate';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RateService', () => {
  let rateService: RateService;

  beforeEach(() => {
    jest.clearAllMocks();
    rateService = RateService.getInstance();
  });

  describe('getBlueRate', () => {
    it('should return the blue rate', async () => {
      const mockBlueRateResponse: BlueRateResponse = {
        moneda: 'USD',
        casa: 'blue',
        nombre: 'Dolar Blue',
        compra: 950,
        venta: 970,
        fechaActualizacion: new Date(),
      };

      mockedAxios.get.mockResolvedValueOnce({ data: mockBlueRateResponse });

      const result = await rateService.getBlueRate();

      expect(result).toBe(mockBlueRateResponse.compra);
      expect(mockedAxios.get).toHaveBeenCalledWith(environment.usdApiUrl);
    });

    it('should throw error when API call fails', async () => {
      const error = new Error('API Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(rateService.getBlueRate()).rejects.toThrow('API Error');
      expect(mockedAxios.get).toHaveBeenCalledWith(environment.usdApiUrl);
    });
  });

  describe('getRates', () => {
    it('should return conversion rates including blue rate', async () => {
      const mockRatesResponse: RatesResponse = {
        result: 'success',
        documentation: 'https://docs.example.com',
        terms_of_use: 'https://terms.example.com',
        time_last_update_unix: Date.now(),
        time_last_update_utc: new Date(),
        time_next_update_unix: Date.now() + 86400000,
        time_next_update_utc: new Date(Date.now() + 86400000),
        base_code: 'USD',
        conversion_rates: {
          EUR: 0.92,
          GBP: 0.79,
          JPY: 150.25,
        },
      };

      const mockBlueRateResponse: BlueRateResponse = {
        moneda: 'USD',
        casa: 'blue',
        nombre: 'Dolar Blue',
        compra: 950,
        venta: 970,
        fechaActualizacion: new Date(),
      };

      mockedAxios.get
        .mockResolvedValueOnce({ data: mockRatesResponse })
        .mockResolvedValueOnce({ data: mockBlueRateResponse });

      const result = await rateService.getRates();

      expect(result).toEqual({
        ...mockRatesResponse.conversion_rates,
        ARS: mockBlueRateResponse.compra,
      });
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        1,
        `${environment.exchangeRateApiUrl}${environment.exchangeRateApiKey}/latest/USD`,
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, environment.usdApiUrl);
    });

    it('should throw error when exchange rate API call fails', async () => {
      const error = new Error('Exchange Rate API Error');
      mockedAxios.get.mockRejectedValueOnce(error);

      await expect(rateService.getRates()).rejects.toThrow(
        'Exchange Rate API Error',
      );
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${environment.exchangeRateApiUrl}${environment.exchangeRateApiKey}/latest/USD`,
      );
    });

    it('should throw error when blue rate API call fails', async () => {
      const mockRatesResponse: RatesResponse = {
        result: 'success',
        documentation: 'https://docs.example.com',
        terms_of_use: 'https://terms.example.com',
        time_last_update_unix: Date.now(),
        time_last_update_utc: new Date(),
        time_next_update_unix: Date.now() + 86400000,
        time_next_update_utc: new Date(Date.now() + 86400000),
        base_code: 'USD',
        conversion_rates: {
          EUR: 0.92,
          GBP: 0.79,
          JPY: 150.25,
        },
      };

      const error = new Error('Blue Rate API Error');
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockRatesResponse })
        .mockRejectedValueOnce(error);

      await expect(rateService.getRates()).rejects.toThrow(
        'Blue Rate API Error',
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(
        1,
        `${environment.exchangeRateApiUrl}${environment.exchangeRateApiKey}/latest/USD`,
      );
      expect(mockedAxios.get).toHaveBeenNthCalledWith(2, environment.usdApiUrl);
    });
  });
});

import { ConversionRates } from '../../domain/entities/Currency';
import axios, { AxiosResponse } from 'axios';
import { environment } from '../../interface/middleware/environment';
import { BlueRateResponse, RatesResponse } from '../../domain/responses/Rate';
import { IRateService } from '../../domain/interfaces/IRateService';

export class RateService implements IRateService {
  async getBlueRate(): Promise<number> {
    const url = `${environment.usdApiUrl}`;
    const response: AxiosResponse<BlueRateResponse, Error> =
      await axios.get(url);
    return response.data.compra;
  }

  async getRates(): Promise<ConversionRates> {
    const url = `${environment.exchangeRateApiUrl}${environment.exchangeRateApiKey}/latest/USD`;
    const response: AxiosResponse<RatesResponse, Error> = await axios.get(url);

    const rates = response.data.conversion_rates;

    rates['ARS'] = await this.getBlueRate();

    return rates;
  }
}

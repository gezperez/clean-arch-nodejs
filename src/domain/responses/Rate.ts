export type ConversionRates = {
  [key: string]: number;
};

export type ExchangeRateAPIResult = 'success' | 'error';

export interface RatesResponse {
  result: ExchangeRateAPIResult;
  documentation: string;
  terms_of_use: string;
  time_last_update_unix: number;
  time_last_update_utc: Date;
  time_next_update_unix: number;
  time_next_update_utc: Date;
  base_code: string;
  conversion_rates: ConversionRates;
}

export interface BlueRateResponse {
  moneda: string;
  casa: string;
  nombre: string;
  compra: number;
  venta: number;
  fechaActualizacion: Date;
}

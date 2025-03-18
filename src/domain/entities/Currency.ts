export interface Currency {
  name: string;
  symbol: string;
  value: number;
}

export type ConversionRates = {
  [key: string]: number;
};

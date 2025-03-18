import mongoose, { Schema } from "mongoose";
import { Currency } from "../../domain/entities/Currency";

const CurrencySchema = new Schema({
  name: { type: String, required: true },
  symbol: { type: String, required: true },
  value: { type: Number, required: true },
});

export const CurrencyModel = mongoose.model<Currency>('Currency', CurrencySchema);
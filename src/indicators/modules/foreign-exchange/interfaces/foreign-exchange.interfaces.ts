import { Document } from 'mongoose';

export interface ForeignExchangeDocument extends Document {
  indicator: string;
  value: number;
  value_to_word: string;
  date: Date;
  update_at: Date;
}

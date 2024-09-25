import { Document } from 'mongoose';

export interface WageDocument extends Document {
  date: Date;
  law: string;
  range: string;
  salary: number;
  value_to_word: string;
}

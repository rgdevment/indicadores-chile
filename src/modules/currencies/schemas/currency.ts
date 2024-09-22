import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { CurrencyDocument } from '@modules/currencies/schemas/currency.document.interface';

@Schema({ collection: 'fx_indicators' })
export class Currency extends Document implements CurrencyDocument {
  @Prop({ type: String, required: true })
  indicator: string;

  @Prop({ type: Number, required: true })
  value: number;

  @Prop({ type: String, required: true })
  value_to_word: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Date, required: true })
  update_at: Date;
}

export const CurrencySchema = SchemaFactory.createForClass(Currency);

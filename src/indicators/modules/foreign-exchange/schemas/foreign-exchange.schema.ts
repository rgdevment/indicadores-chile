import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ForeignExchangeDocument } from '../interfaces/foreign-exchange.interfaces';

@Schema({ collection: 'fx_indicators' })
export class ForeignExchange extends Document implements ForeignExchangeDocument {
  @Prop({ required: true })
  indicator: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  value_to_word: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  update_at: Date;
}

export const FxSchema = SchemaFactory.createForClass(ForeignExchange);

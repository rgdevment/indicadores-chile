// src/indicators/economic/schemas/economic-indicator.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class EconomicIndicator extends Document {
  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  value: number;

  @Prop({ required: true })
  value_to_word: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  update_at: Date;
}

export const EconomicIndicatorSchema = SchemaFactory.createForClass(EconomicIndicator);

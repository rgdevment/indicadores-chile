import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'economic_indicators' })
export class Economic extends Document {
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

export const EconomicSchema = SchemaFactory.createForClass(Economic);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { EconomicDocument } from '@modules/economics/schemas/economic.document.interface';

@Schema({ collection: 'economic_indicators' })
export class Economic extends Document implements EconomicDocument {
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

export const EconomicSchema = SchemaFactory.createForClass(Economic);

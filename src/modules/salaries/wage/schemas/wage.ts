import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';

@Schema({ collection: 'minimum_salary_indicators' })
export class Wage extends Document implements WageDocument {
  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: String, required: true })
  law: string;

  @Prop({ type: String, required: true })
  range: string;

  @Prop({ type: Number, required: true })
  salary: number;

  @Prop({ type: String, required: true })
  value_to_word: string;
}

export const WageSchema = SchemaFactory.createForClass(Wage);

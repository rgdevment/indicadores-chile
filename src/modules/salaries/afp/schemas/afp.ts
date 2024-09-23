import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AfpDocument } from '@modules/salaries/afp/schemas/afp.document.interface';

@Schema({ collection: 'afp_indicators' })
export class Afp extends Document implements AfpDocument {
  @Prop({ type: String, required: true })
  category: string;

  @Prop({ type: Number, required: true })
  commission: number;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  sub_category: string;

  @Prop({ type: Date, required: true })
  date: Date;

  @Prop({ type: Date, required: true })
  update_at: Date;
}

export const AfpSchema = SchemaFactory.createForClass(Afp);

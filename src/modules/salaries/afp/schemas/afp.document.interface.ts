import { Document } from 'mongoose';

export interface AfpDocument extends Document {
  category: string;
  commission: number | string;
  name: string;
  sub_category: string;
  date: Date;
  update_at: Date;
}

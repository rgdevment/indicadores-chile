import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';

export interface WageRepository {
  findAll(): Promise<WageDocument[]>;
}

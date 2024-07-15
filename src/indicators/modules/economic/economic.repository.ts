import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Economic } from './schemas/economic.schema';
import { EconomicDocument } from './interfaces/economic.interface';
import { BaseRepository } from '../base.repository';

@Injectable()
export class EconomicRepository extends BaseRepository<EconomicDocument> {
  constructor(@InjectModel(Economic.name) model: Model<EconomicDocument>) {
    super(model);
  }
}

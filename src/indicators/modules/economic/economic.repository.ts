import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Economic } from './schemas/economic.schema';
import { EconomicDocument } from './interfaces/economic.interface';
import { IndicatorsRepository } from '../indicators.repository';

@Injectable()
export class EconomicRepository extends IndicatorsRepository<EconomicDocument> {
  constructor(@InjectModel(Economic.name) model: Model<EconomicDocument>) {
    super(model);
  }
}

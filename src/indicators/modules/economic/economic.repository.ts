import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Economic } from './schemas/economic.schema';
import { EconomicDocument } from './interfaces/economic.interface';
import { BaseRepository } from '../base.repository';
import { EconomicRepositoryInterface } from './interfaces/economic-repository.interface';

@Injectable()
export class EconomicRepository extends BaseRepository<EconomicDocument> implements EconomicRepositoryInterface {
  constructor(@InjectModel(Economic.name) model: Model<EconomicDocument>) {
    super(model);
  }
}

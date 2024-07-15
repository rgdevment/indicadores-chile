import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IndicatorsRepository } from '../indicators.repository';
import { ForeignExchangeDocument } from './interfaces/foreign-exchange.interfaces';
import { ForeignExchange } from './schemas/foreign-exchange.schema';

@Injectable()
export class ForeignExchangeRepository extends IndicatorsRepository<ForeignExchangeDocument> {
  constructor(@InjectModel(ForeignExchange.name) model: Model<ForeignExchangeDocument>) {
    super(model);
  }
}

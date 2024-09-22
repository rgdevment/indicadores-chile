import { Injectable } from '@nestjs/common';
import { IndicatorsRepository } from '@common/repositories/indicators.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EconomicRepository } from '@modules/economics/repositories/economic.repository.interface';
import { EconomicDocument } from '@modules/economics/schemas/economic.document.interface';
import { Economic } from '@modules/economics/schemas/economic';

@Injectable()
export class EconomicRepositoryMongo extends IndicatorsRepository<EconomicDocument> implements EconomicRepository {
  constructor(@InjectModel(Economic.name) model: Model<EconomicDocument>) {
    super(model);
  }
}

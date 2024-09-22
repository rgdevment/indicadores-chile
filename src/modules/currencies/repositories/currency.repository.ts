import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CurrencyRepository } from '@modules/currencies/repositories/currency.repository.interface';
import { CurrencyDocument } from '@modules/currencies/schemas/currency.document.interface';
import { Currency } from '@modules/currencies/schemas/currency';
import { IndicatorsRepository } from '@common/repositories/indicators.repository';

@Injectable()
export class CurrencyRepositoryMongo extends IndicatorsRepository<CurrencyDocument> implements CurrencyRepository {
  constructor(@InjectModel(Currency.name) model: Model<CurrencyDocument>) {
    super(model);
  }
}

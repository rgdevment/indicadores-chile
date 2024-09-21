import { Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Currency, CurrencySchema } from '@modules/currencies/schemas/Currency';
import { CurrencyRepositoryMongo } from '@modules/currencies/repositories/currency.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Currency.name, schema: CurrencySchema }])],
  providers: [CurrenciesService, { provide: 'CurrencyRepository', useClass: CurrencyRepositoryMongo }],
  controllers: [CurrenciesController],
})
export class CurrenciesModule {}

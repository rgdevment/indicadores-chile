import { Module } from '@nestjs/common';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrencyRepository } from './repositories/currency.repository';

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrencyRepository],
})
export class CurrenciesModule {}

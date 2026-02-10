import { IndicatorValueEntity } from '@entities/indicator-value.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurrenciesController } from './currencies.controller';
import { CurrenciesService } from './currencies.service';
import { CurrencyRepository } from './repositories/currency.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IndicatorValueEntity])],
  controllers: [CurrenciesController],
  providers: [CurrenciesService, CurrencyRepository],
})
export class CurrenciesModule {}

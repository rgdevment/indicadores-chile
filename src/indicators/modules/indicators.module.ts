import { Module } from '@nestjs/common';
import { EconomicModule } from './economic/economic.module';
import { ForeignExchangeModule } from './foreign-exchange/foreign-exchange.module';
import { IndicatorsController } from './indicators.controller';

@Module({
  imports: [EconomicModule, ForeignExchangeModule],
  controllers: [IndicatorsController],
})
export class IndicatorsModule {}

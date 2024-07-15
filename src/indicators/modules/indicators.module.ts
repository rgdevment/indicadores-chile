import { Module } from '@nestjs/common';
import { EconomicModule } from './economic/economic.module';
import { ForeignExchangeModule } from './foreign-exchange/foreign-exchange.module';
import { SalaryModule } from './salary/salary.module';

@Module({
  imports: [EconomicModule, ForeignExchangeModule, SalaryModule],
})
export class IndicatorsModule {}

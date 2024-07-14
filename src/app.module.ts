import { Module } from '@nestjs/common';
import { IndicatorsModule } from './indicators/indicators.module';

@Module({
  imports: [IndicatorsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

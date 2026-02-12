import { Module } from '@nestjs/common';
import { EconomicsController } from './economics.controller';
import { EconomicsService } from './economics.service';
import { EconomicRepository } from './repositories/economic.repository';

@Module({
  controllers: [EconomicsController],
  providers: [EconomicsService, EconomicRepository],
})
export class EconomicsModule {}

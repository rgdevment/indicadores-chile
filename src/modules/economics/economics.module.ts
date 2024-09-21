import { Module } from '@nestjs/common';
import { EconomicsController } from './economics.controller';
import { EconomicsService } from './economics.service';

@Module({
  controllers: [EconomicsController],
  providers: [EconomicsService],
})
export class EconomicsModule {}

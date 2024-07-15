import { Module } from '@nestjs/common';
import { EconomicService } from './economic.service';
import { EconomicController } from './economic.controller';

@Module({
  providers: [EconomicService],
  controllers: [EconomicController],
})
export class EconomicModule {}

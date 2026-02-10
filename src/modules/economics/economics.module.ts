import { IndicatorValueEntity } from '@entities/indicator-value.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EconomicsController } from './economics.controller';
import { EconomicsService } from './economics.service';
import { EconomicRepository } from './repositories/economic.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IndicatorValueEntity])],
  controllers: [EconomicsController],
  providers: [EconomicsService, EconomicRepository],
})
export class EconomicsModule {}

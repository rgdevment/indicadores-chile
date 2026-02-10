import { WageEntity } from '@entities/wage.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WageRepository } from './repositories/wage.repository';
import { WageController } from './wage.controller';
import { WageService } from './wage.service';

@Module({
  imports: [TypeOrmModule.forFeature([WageEntity])],
  controllers: [WageController],
  providers: [WageService, WageRepository],
})
export class WageModule {}

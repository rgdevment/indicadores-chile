import { Module } from '@nestjs/common';
import { WageRepository } from './repositories/wage.repository';
import { WageController } from './wage.controller';
import { WageService } from './wage.service';

@Module({
  controllers: [WageController],
  providers: [WageService, WageRepository],
})
export class WageModule {}

import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';
import { WageService } from './wage.service';

@Module({
  controllers: [WageController],
  providers: [WageService],
})
export class WageModule {}

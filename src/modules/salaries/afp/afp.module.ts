import { Module } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AfpController } from './afp.controller';

@Module({
  providers: [AfpService],
  controllers: [AfpController],
})
export class AfpModule {}

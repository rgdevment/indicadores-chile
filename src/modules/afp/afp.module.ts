import { Module } from '@nestjs/common';
import { AfpController } from './afp.controller';
import { AfpService } from './afp.service';
import { AfpRepository } from './repositories/afp.repository';

@Module({
  controllers: [AfpController],
  providers: [AfpService, AfpRepository],
})
export class AfpModule {}

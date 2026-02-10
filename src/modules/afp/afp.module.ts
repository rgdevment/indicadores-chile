import { AfpEntity } from '@entities/afp.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AfpController } from './afp.controller';
import { AfpService } from './afp.service';
import { AfpRepository } from './repositories/afp.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AfpEntity])],
  controllers: [AfpController],
  providers: [AfpService, AfpRepository],
})
export class AfpModule {}

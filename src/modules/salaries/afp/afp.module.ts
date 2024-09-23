import { Module } from '@nestjs/common';
import { AfpController } from './afp.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Afp, AfpSchema } from '@modules/salaries/afp/schemas/afp';
import { AfpRepositoryMongo } from '@modules/salaries/afp/repositories/afp.repository';
import { AfpService } from '@modules/salaries/afp/afp.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Afp.name, schema: AfpSchema }])],
  providers: [AfpService, { provide: 'AfpRepository', useClass: AfpRepositoryMongo }],
  controllers: [AfpController],
})
export class AfpModule {}

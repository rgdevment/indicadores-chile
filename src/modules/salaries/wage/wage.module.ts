import { Module } from '@nestjs/common';
import { WageController } from './wage.controller';
import { WageService } from './wage.service';
import { MongooseModule } from '@nestjs/mongoose';
import { WageRepositoryMongo } from '@modules/salaries/wage/repositories/wage.repository';
import { Wage, WageSchema } from '@modules/salaries/wage/schemas/wage';

@Module({
  controllers: [WageController],
  imports: [MongooseModule.forFeature([{ name: Wage.name, schema: WageSchema }])],
  providers: [WageService, { provide: 'WageRepository', useClass: WageRepositoryMongo }],
})
export class WageModule {}

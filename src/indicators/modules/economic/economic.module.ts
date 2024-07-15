import { Module } from '@nestjs/common';
import { EconomicService } from './economic.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Economic, EconomicSchema } from './schemas/economic.schema';
import { EconomicRepository } from './economic.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: Economic.name, schema: EconomicSchema }])],
  providers: [EconomicService, EconomicRepository],
  exports: [EconomicService],
})
export class EconomicModule {}

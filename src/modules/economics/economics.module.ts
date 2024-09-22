import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Economic, EconomicSchema } from '@modules/economics/schemas/economic';
import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicRepositoryMongo } from '@modules/economics/repositories/economic.repository';
import { EconomicsController } from '@modules/economics/economics.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Economic.name, schema: EconomicSchema }])],
  providers: [EconomicsService, { provide: 'EconomicRepository', useClass: EconomicRepositoryMongo }],
  controllers: [EconomicsController],
})
export class EconomicsModule {}

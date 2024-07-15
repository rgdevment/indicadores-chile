import { Module } from '@nestjs/common';
import { ForeignExchangeService } from './foreign-exchange.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ForeignExchange, FxSchema } from './schemas/foreign-exchange.schema';
import { ForeignExchangeRepository } from './foreign-exchange.repository';

@Module({
  imports: [MongooseModule.forFeature([{ name: ForeignExchange.name, schema: FxSchema }])],
  providers: [ForeignExchangeService, ForeignExchangeRepository],
  exports: [ForeignExchangeService],
})
export class ForeignExchangeModule {}

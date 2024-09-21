import { Module } from '@nestjs/common';
import { WageModule } from './wage/wage.module';
import { AfpModule } from './afp/afp.module';

@Module({
  imports: [WageModule, AfpModule],
})
export class SalariesModule {}

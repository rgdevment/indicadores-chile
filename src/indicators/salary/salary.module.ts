import { Module } from '@nestjs/common';
import { AfpModule } from './afp/afp.module';
import { MinimumSalaryModule } from './minimum-salary/minimum-salary.module';

@Module({
  imports: [AfpModule, MinimumSalaryModule]
})
export class SalaryModule {}

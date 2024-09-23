import { ApiProperty } from '@nestjs/swagger';

export class CommissionVoluntarySavingDto {
  @ApiProperty({ example: 0.89, description: 'Comisiones Ahorro Voluntario para afiliados', required: false })
  affiliated?: number;
}

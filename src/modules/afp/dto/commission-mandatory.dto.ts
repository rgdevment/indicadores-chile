import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionMandatoryDto {
  @ApiPropertyOptional({ example: 11.44, description: 'Cotización por depósito (%)' })
  deposit?: number;

  @ApiPropertyOptional({ example: 1.25, description: 'Retiros (%)' })
  withdrawals?: number;

  @ApiPropertyOptional({ example: 0, description: 'Traspasos (%)' })
  transfer?: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionVoluntaryPensionDto {
  @ApiPropertyOptional({ example: 0.95, description: 'Afiliados (%)' })
  affiliated?: number;

  @ApiPropertyOptional({ example: 0.95, description: 'No afiliados (%)' })
  nonAffiliated?: number;

  @ApiPropertyOptional({ example: 0, description: 'Traspasos (%)' })
  transfer?: number;
}

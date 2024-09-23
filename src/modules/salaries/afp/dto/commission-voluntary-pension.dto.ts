import { ApiProperty } from '@nestjs/swagger';

export class CommissionVoluntaryPensionDto {
  @ApiProperty({ example: 0.51, description: 'Comisiones APV para afiliados', required: false })
  affiliated?: number;

  @ApiProperty({ example: 0.51, description: 'Comisiones APV para no afiliados', required: false })
  nonAffiliated?: number;

  @ApiProperty({ example: 1.101, description: 'Comisiones APV para transferencias', required: false })
  transfer?: number;
}

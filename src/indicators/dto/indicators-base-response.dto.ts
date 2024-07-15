import { ApiProperty } from '@nestjs/swagger';

export class IndicatorsBaseResponseDto {
  @ApiProperty({ example: 'UF', description: 'El nombre o tipo de indicador.' })
  indicator: string;

  constructor(indicator: string) {
    this.indicator = indicator;
  }
}

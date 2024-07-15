import { ApiProperty } from '@nestjs/swagger';

export class IndicatorBaseResponseDto {
  @ApiProperty({ example: 'UF', description: 'El nombre o tipo de indicador.' })
  indicator: string;

  constructor(indicator: string) {
    this.indicator = indicator;
  }
}

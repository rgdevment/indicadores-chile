import { IndicatorsValueDto } from './indicators-value.dto';
import { IndicatorsBaseResponseDto } from './indicators-base-response.dto';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class IndicatorsResponseDto extends IndicatorsBaseResponseDto {
  data: IndicatorsValueDto[];
  @ApiProperty({ example: 123.45, description: 'El promedio del mes en curso del indicador.' })
  average?: number;
  @ApiProperty({ example: 123.45, description: 'El valor acumulado del año actual del indicador.' })
  accumulated?: number;
  @ApiProperty({ example: 123.45, description: 'El valor acumulado de los últimos 12 meses.' })
  @Expose({ name: 'accumulated_yearly' })
  accumulatedYearly?: number;

  constructor({
    indicator,
    data,
    average,
    accumulated,
    accumulatedYearly,
  }: {
    indicator: string;
    data: IndicatorsValueDto[];
    average?: number;
    accumulated?: number;
    accumulatedYearly?: number;
  }) {
    super(indicator);
    this.average = average;
    this.accumulated = accumulated;
    this.accumulatedYearly = accumulatedYearly;
    this.data = data;
  }
}
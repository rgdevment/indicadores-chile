import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { Expose } from 'class-transformer';

export class EconomicResponseDto {
  @ApiProperty({
    description: 'Indicador económico para el cual se calculan los valores',
    example: 'UF',
  })
  indicator: string;

  @ApiPropertyOptional({ example: 123.45, description: 'El promedio del mes en curso del indicador económico.' })
  average?: number;

  @ApiPropertyOptional({ example: 123.45, description: 'El valor acumulado del año actual del indicador económico.' })
  accumulated?: number;

  @ApiPropertyOptional({ example: 123.45, description: 'El valor acumulado de los últimos 12 meses.' })
  @Expose({ name: 'accumulated_yearly' })
  accumulatedYearly?: number;

  @ApiProperty({
    description: 'Listado de los valores actuales',
    type: [IndicatorValueDto],
  })
  records: IndicatorValueDto[];

  constructor(partial: Partial<EconomicResponseDto>) {
    Object.assign(this, partial);
  }
}

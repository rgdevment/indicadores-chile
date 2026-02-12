import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EconomicResponseDto {
  @ApiProperty({ example: 'UF', description: 'Tipo de indicador económico' })
  indicator!: string;

  @ApiPropertyOptional({ example: 38_200.5, description: 'Promedio del mes' })
  average?: number;

  @ApiPropertyOptional({ example: 4.5, description: 'Acumulado últimos 12 meses' })
  accumulated?: number;

  @ApiPropertyOptional({ example: 2.1, description: 'Acumulado año en curso' })
  accumulatedYearly?: number;

  @ApiProperty({ type: [IndicatorValueDto], description: 'Registros del indicador' })
  records!: IndicatorValueDto[];
}

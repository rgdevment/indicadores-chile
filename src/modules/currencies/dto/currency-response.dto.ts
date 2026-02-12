import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({ example: 'DOLAR', description: 'Tipo de divisa' })
  currency!: string;

  @ApiPropertyOptional({ example: 948.12, description: 'Promedio del mes actual' })
  average?: number;

  @ApiProperty({ type: [IndicatorValueDto], description: 'Registros del indicador' })
  records!: IndicatorValueDto[];
}

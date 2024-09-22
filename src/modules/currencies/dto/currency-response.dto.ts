import { ApiProperty } from '@nestjs/swagger';
import { IndicatorValueDto } from '@common/dto/indicator-value.dto';

export class CurrencyResponseDto {
  @ApiProperty({
    description: 'Moneda para la cual se calculan los valores',
    example: 'EURO',
  })
  currency: string;

  @ApiProperty({
    description: 'Promedio de los valores del mes',
    example: 1032.35,
  })
  average: number;

  @ApiProperty({
    description: 'Listado de los valores actuales y el primer valor del mes',
    type: [IndicatorValueDto],
  })
  records: IndicatorValueDto[];

  constructor(partial: Partial<CurrencyResponseDto>) {
    Object.assign(this, partial);
  }
}

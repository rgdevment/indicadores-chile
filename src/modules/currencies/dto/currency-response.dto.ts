import { ApiProperty } from '@nestjs/swagger';
import { CurrencyValueDto } from '@modules/currencies/dto/currency-value.dto';

export class CurrenciesResponseDto {
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
    type: [CurrencyValueDto],
  })
  data: CurrencyValueDto[];

  constructor(partial: Partial<CurrenciesResponseDto>) {
    Object.assign(this, partial);
  }
}

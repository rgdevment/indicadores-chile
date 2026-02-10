import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class WageEntryDto {
  @ApiProperty({ example: 500_000, description: 'Monto del salario mínimo' })
  amount!: number;

  @ApiPropertyOptional({ example: 'quinientos mil pesos', description: 'Valor en palabras' })
  details?: string;

  @ApiPropertyOptional({ example: 'Ley 21.578', description: 'Ley que establece el salario' })
  law?: string;

  @ApiPropertyOptional({ example: '18 a 65 años', description: 'Rango de edad' })
  range?: string;

  @ApiProperty({ example: '2026-01-01', description: 'Fecha de vigencia' })
  @Transform(({ value }) => (value instanceof Date ? value.toISOString().slice(0, 10) : value))
  date!: string;
}

import { IsDateString, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WageEntryDto {
  @ApiProperty({
    description: 'Monto del salario mínimo en pesos',
    example: 500000,
  })
  @IsInt()
  amount: number;

  @ApiProperty({
    description: 'Descripción detallada del salario mínimo en palabras',
    example: 'quinientos mil pesos',
  })
  @IsString()
  details: string;

  @ApiProperty({
    description: 'Ley que establece el salario mínimo',
    example: 'Ley 21.578 (30-05-2022)',
  })
  @IsString()
  law: string;

  @ApiProperty({
    description: 'Rango de edad aplicable para el salario mínimo',
    example: '18<edad≤65',
  })
  @IsString()
  range: string;

  @ApiProperty({
    description: 'Fecha de vigencia del salario mínimo',
    example: '2024-07-01',
    type: String,
    format: 'date',
  })
  @IsDateString()
  date: string;

  constructor(amount: number, details: string, law: string, range: string, date: Date) {
    this.amount = amount;
    this.details = details;
    this.law = law;
    this.range = range;
    this.date = date.toISOString().split('T')[0];
  }
}

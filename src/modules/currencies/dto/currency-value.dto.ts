import { ApiProperty } from '@nestjs/swagger';

export class CurrencyValueDto {
  @ApiProperty({
    description: 'La fecha en formato ISO',
    example: '2024-09-17',
  })
  date: string;

  @ApiProperty({
    description: 'El valor del indicador para la fecha',
    example: 1026.99,
  })
  value: number;

  @ApiProperty({
    description: 'El valor escrito en palabras',
    example: 'mil veintiséis pesos con noventa y nueve céntimos',
  })
  details: string;

  @ApiProperty({
    description: 'Nota adicional sobre el valor',
    example: 'Valor actualizado al día de hoy, o del último registro disponible.',
  })
  _note: string;

  constructor(date: Date, value: number, details: string, note: string) {
    this.date = date.toISOString().split('T')[0];
    this.value = value;
    this.details = details;
    this._note = note;
  }
}

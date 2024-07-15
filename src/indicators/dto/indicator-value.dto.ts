import { ApiProperty } from '@nestjs/swagger';

export class IndicatorValueDto {
  @ApiProperty({ example: 37591.0, description: 'El valor en decimal del indicador.' })
  value: number;
  @ApiProperty({ example: '2024-06-29', description: 'Fecha a la que corresponde el valor del indicador.' })
  date: string;
  @ApiProperty({
    example: 'treinta y siete mil seiscientos dos pesos',
    description: 'El valor del indicador en texto.',
  })
  details: string;
  _note?: string;

  constructor(value: number, date: Date, value_to_word: string, _note?: string) {
    this.date = this.formatDate(date);
    this.value = value;
    this.details = value_to_word;
    this._note = _note;
  }

  private formatDate(date: Date): string {
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  }
}

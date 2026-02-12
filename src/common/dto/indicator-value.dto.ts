import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class IndicatorValueDto {
  @ApiProperty({ example: '2026-02-10', description: 'Fecha del registro (YYYY-MM-DD)' })
  date!: string;

  @ApiProperty({ example: 950.25, description: 'Valor numérico del indicador' })
  value!: number;

  @ApiPropertyOptional({ example: 'novecientos cincuenta con veinticinco', description: 'Valor en palabras' })
  details?: string;

  @ApiPropertyOptional({ description: 'Nota contextual sobre el valor' })
  _note?: string;

  constructor(partial: Partial<IndicatorValueDto>) {
    Object.assign(this, partial);
  }

  static fromEntity(
    entity: { recorded_date: string; value: number | string; value_to_word?: string | null },
    note?: string,
  ): IndicatorValueDto {
    return new IndicatorValueDto({
      date: entity.recorded_date,
      value: Number(entity.value),
      details: entity.value_to_word ?? undefined,
      _note: note,
    });
  }
}

import { IndicatorValueDto } from '@common/dto/indicator-value.dto';

describe('IndicatorValueDto', () => {
  it('should create from entity', () => {
    const dto = IndicatorValueDto.fromEntity(
      { recorded_date: '2026-02-10', value: 950.25, value_to_word: 'novecientos cincuenta' },
      'Test note',
    );
    expect(dto.date).toBe('2026-02-10');
    expect(dto.value).toBe(950.25);
    expect(dto.details).toBe('novecientos cincuenta');
    expect(dto._note).toBe('Test note');
  });

  it('should handle null value_to_word', () => {
    const dto = IndicatorValueDto.fromEntity({ recorded_date: '2026-01-01', value: 100, value_to_word: null });
    expect(dto.details).toBeUndefined();
    expect(dto._note).toBeUndefined();
  });
});

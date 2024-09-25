import { plainToInstance } from 'class-transformer';
import { WageResponseDto } from '@modules/salaries/wage/dto/wage-response.dto';
import { WageEntryDto } from '@modules/salaries/wage/dto/wage-entry.dto';

describe('WageResponseDto', () => {
  it('should transform plain object to WageResponseDto with WageEntryDto instances due to @Type decorator', () => {
    const plainObject = {
      current: {
        amount: 500000,
        details: 'quinientos mil pesos',
        law: 'Ley 21.578',
        range: '18<edad≤65',
        date: '2024-07-01T00:00:00.000Z',
      },
      historic: [
        {
          amount: 460000,
          details: 'cuatrocientos sesenta mil pesos',
          law: 'Ley 21.578',
          range: '18<edad≤65',
          date: '2023-09-01T00:00:00.000Z',
        },
        {
          amount: 410000,
          details: 'cuatrocientos diez mil pesos',
          law: 'Ley 21.456',
          range: '18<edad≤65',
          date: '2023-01-01T00:00:00.000Z',
        },
      ],
    };

    const transformed = plainToInstance(WageResponseDto, plainObject);

    // Verificar que 'transformed' es una instancia de WageResponseDto
    expect(transformed).toBeInstanceOf(WageResponseDto);

    // Verificar que 'current' es una instancia de WageEntryDto
    expect(transformed.current).toBeInstanceOf(WageEntryDto);

    // Verificar que 'historic' es un arreglo de WageEntryDto
    expect(transformed.historic).toBeInstanceOf(Array);
    transformed.historic.forEach(entry => {
      expect(entry).toBeInstanceOf(WageEntryDto);
    });
  });
});

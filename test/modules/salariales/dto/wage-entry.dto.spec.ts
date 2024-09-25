import { plainToInstance } from 'class-transformer';
import { WageEntryDto } from '@modules/salaries/wage/dto/wage-entry.dto';

describe('WageEntryDto', () => {
  it('should transform date when value is a Date instance', () => {
    const dateValue = new Date('2024-07-01T00:00:00.000Z');

    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: dateValue,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toBe('2024-07-01');
  });

  it('should transform date when value is a string', () => {
    const dateValue = '2024-07-01T00:00:00.000Z';

    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: dateValue,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toBe('2024-07-01');
  });

  it('should return value as is when date is neither Date nor string', () => {
    const invalidDateValue = 12345;

    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: invalidDateValue,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toBe(invalidDateValue);
  });

  it('should return value as is when date is null', () => {
    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: null,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toBeNull();
  });

  it('should return value as is when date is undefined', () => {
    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: undefined,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toBeUndefined();
  });

  it('should return value as is when date is an object', () => {
    const invalidDateValue = { year: 2024, month: 7, day: 1 };

    const plainObject = {
      amount: 500000,
      details: 'quinientos mil pesos',
      law: 'Ley 21.578',
      range: '18<edad≤65',
      date: invalidDateValue,
    };

    const transformed = plainToInstance(WageEntryDto, plainObject);

    expect(transformed.date).toEqual(invalidDateValue);
  });
});

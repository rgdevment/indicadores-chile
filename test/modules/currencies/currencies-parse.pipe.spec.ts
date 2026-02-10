import { CurrenciesParsePipe } from '@modules/currencies/validators/currencies-parse.pipe';
import { BadRequestException } from '@nestjs/common';

describe('CurrenciesParsePipe', () => {
  const pipe = new CurrenciesParsePipe();

  it('should accept valid currencies (case insensitive)', () => {
    expect(pipe.transform('dolar', {} as any)).toBe('DOLAR');
    expect(pipe.transform('EURO', {} as any)).toBe('EURO');
  });

  it('should throw BadRequestException for invalid currency', () => {
    expect(() => pipe.transform('BITCOIN', {} as any)).toThrow(BadRequestException);
  });
});

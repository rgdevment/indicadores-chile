import { BadRequestException, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CurrenciesParsePipe } from '@modules/currencies/validators/currencies-parse.pipe';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';

describe('CurrenciesParsePipe', () => {
  let pipe: CurrenciesParsePipe;
  let i18nService: I18nService;

  beforeEach(() => {
    i18nService = {
      t: jest.fn().mockReturnValue('Invalid currency value'),
    } as unknown as I18nService;
    pipe = new CurrenciesParsePipe(i18nService);
    jest.spyOn(Logger, 'log');
  });

  it('should return a valid enum value for a valid currency', () => {
    const validCurrency = 'DOLAR';

    const result = pipe.transform(validCurrency);

    expect(result).toBe(CurrenciesEnum.DOLAR);
  });

  it('should throw BadRequestException for an invalid currency', () => {
    const invalidCurrency = 'YEN';

    expect(() => pipe.transform(invalidCurrency)).toThrow(BadRequestException);
    expect(i18nService.t).toHaveBeenCalledWith('currencies.INVALID_CURRENCY_VALUE', {
      args: { value: invalidCurrency },
    });
    expect(Logger.log).toHaveBeenCalled();
  });
});

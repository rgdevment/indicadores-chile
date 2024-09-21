import { BadRequestException, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { IndicatorsEnum } from '@modules/indicators.enum';
import { IndicatorsParsePipe } from '../../../../backup/indicators/validators/indicators-parse.pipe';

describe('IndicatorsParsePipe', () => {
  let pipe: IndicatorsParsePipe;
  let i18nService: jest.Mocked<I18nService>;
  let loggerSpy: jest.SpyInstance;

  beforeEach(() => {
    i18nService = {
      t: jest.fn().mockReturnValue('Invalid indicator value'),
    } as unknown as jest.Mocked<I18nService>;

    pipe = new IndicatorsParsePipe(i18nService);
    loggerSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return enum value when valid', () => {
    const result = pipe.transform('uf');
    expect(result).toBe(IndicatorsEnum.UF);
    expect(i18nService.t).not.toHaveBeenCalled();
    expect(loggerSpy).not.toHaveBeenCalled();
  });

  it('should throw BadRequestException when invalid value', () => {
    const invalidValue = 'INVALID';
    const message = 'Invalid indicator value';

    i18nService.t.mockReturnValue(message);

    expect(() => pipe.transform(invalidValue)).toThrow(BadRequestException);
    expect(i18nService.t).toHaveBeenCalledWith('indicators.INVALID_INDICATOR_VALUE', { args: { value: invalidValue } });
    expect(loggerSpy).toHaveBeenCalledWith(message, 'IndicatorsParsePipe');
  });

  it('should handle lowercase and convert to uppercase', () => {
    const result = pipe.transform('dolar');
    expect(result).toBe(IndicatorsEnum.DOLAR);
  });
});

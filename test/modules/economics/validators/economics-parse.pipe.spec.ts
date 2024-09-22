import { BadRequestException, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicsParsePipe } from '@modules/economics/validators/economics-parse.pipe';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';

describe('EconomicsParsePipe', () => {
  let pipe: EconomicsParsePipe;
  let i18nService: I18nService;

  beforeEach(() => {
    i18nService = {
      t: jest.fn().mockReturnValue('Invalid indicator value'),
    } as unknown as I18nService;
    pipe = new EconomicsParsePipe(i18nService);
    jest.spyOn(Logger, 'log');
  });

  it('should return a valid enum value for a valid indicator', () => {
    const validIndicator = 'UF';

    const result = pipe.transform(validIndicator);

    expect(result).toBe(EconomicsEnum.UF);
  });

  it('should throw BadRequestException for an invalid indicator', () => {
    const invalidIndicator = 'INVALID';

    expect(() => pipe.transform(invalidIndicator)).toThrow(BadRequestException);
    expect(i18nService.t).toHaveBeenCalledWith('indicators.INVALID_INDICATOR_VALUE', {
      args: { value: invalidIndicator },
    });
    expect(Logger.log).toHaveBeenCalled();
  });
});

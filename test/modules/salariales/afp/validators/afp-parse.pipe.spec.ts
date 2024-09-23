import { BadRequestException, Logger } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AfpParsePipe } from '@modules/salaries/afp/validators/afp-parse.pipe';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';

describe('AFPParsePipe', () => {
  let pipe: AfpParsePipe;
  let i18nService: I18nService;

  beforeEach(() => {
    i18nService = {
      t: jest.fn().mockReturnValue('Invalid AFP value'),
    } as unknown as I18nService;
    pipe = new AfpParsePipe(i18nService);
    jest.spyOn(Logger, 'log');
  });

  it('should return a valid enum value for a valid AFP', () => {
    const validIndicator = 'CAPITAL';

    const result = pipe.transform(validIndicator);

    expect(result).toBe(AfpEnum.CAPITAL);
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

import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';

@Injectable()
export class AfpParsePipe implements PipeTransform<string, AfpEnum> {
  constructor(private readonly i18n: I18nService) {}

  transform(value: string): AfpEnum {
    const enumValue = value.toUpperCase() as unknown as AfpEnum;

    if (!Object.values(AfpEnum).includes(enumValue)) {
      const message = this.i18n.t('indicators.INVALID_INDICATOR_VALUE', { args: { value } });
      Logger.log(message, 'IndicatorsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

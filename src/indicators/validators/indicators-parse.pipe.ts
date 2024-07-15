import { PipeTransform, Injectable, BadRequestException, Logger } from '@nestjs/common';
import { IndicatorsEnum } from '../modules/indicators.enum';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class IndicatorsParsePipe implements PipeTransform<string, IndicatorsEnum> {
  constructor(private readonly i18n: I18nService) {}

  transform(value: string): IndicatorsEnum {
    const enumValue = value.toUpperCase() as unknown as IndicatorsEnum;

    if (!Object.values(IndicatorsEnum).includes(enumValue)) {
      const message = this.i18n.t('indicators.INVALID_INDICATOR_VALUE', { args: { value } });
      Logger.log(message, 'IndicatorsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

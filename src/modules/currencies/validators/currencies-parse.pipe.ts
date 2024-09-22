import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { CurrenciesEnum } from '../enums/currencies.enum';

@Injectable()
export class CurrenciesParsePipe implements PipeTransform<string, CurrenciesEnum> {
  constructor(private readonly i18n: I18nService) {}

  transform(value: string): CurrenciesEnum {
    const enumValue = value.toUpperCase() as unknown as CurrenciesEnum;

    if (!Object.values(CurrenciesEnum).includes(enumValue)) {
      const message = this.i18n.t('currencies.INVALID_CURRENCY_VALUE', { args: { value } });
      Logger.log(message, 'IndicatorsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

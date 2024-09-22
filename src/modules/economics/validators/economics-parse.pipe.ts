import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';

@Injectable()
export class EconomicsParsePipe implements PipeTransform<string, EconomicsEnum> {
  constructor(private readonly i18n: I18nService) {}

  transform(value: string): EconomicsEnum {
    const enumValue = value.toUpperCase() as unknown as EconomicsEnum;

    if (!Object.values(EconomicsEnum).includes(enumValue)) {
      const message = this.i18n.t('indicators.INVALID_INDICATOR_VALUE', { args: { value } });
      Logger.log(message, 'IndicatorsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

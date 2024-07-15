import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicEnum } from '../economic.enum';

@Injectable()
export class EconomicParsePipe implements PipeTransform<string, EconomicEnum> {
  constructor(private readonly i18n: I18nService) {}

  transform(value: string): EconomicEnum {
    const enumValue = value.toUpperCase() as unknown as EconomicEnum;

    if (!Object.values(EconomicEnum).includes(enumValue)) {
      const message = this.i18n.t('indicators.invalidIndicatorValue', { args: { value } });
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

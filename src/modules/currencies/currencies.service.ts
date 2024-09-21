import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyRepository } from '@modules/currencies/repositories/currency.repository.interface';
import { IndicatorsEnum } from '../../common/enums/indicators.enum';
import { I18nService } from 'nestjs-i18n';
import { CurrenciesResponseDto } from '@modules/currencies/dto/currency-response.dto';
import { IndicatorsRecord } from '../../common/interfaces/indicators-record.interface';
import { CurrencyValueDto } from '@modules/currencies/dto/currency-value.dto';

@Injectable()
export class CurrenciesService {
  constructor(
    @Inject('CurrencyRepository') private readonly repository: CurrencyRepository,
    private readonly i18n: I18nService,
  ) {}

  private async getCurrencyValueDto(
    indicatorRecord: IndicatorsRecord | null,
    indicator: string,
    noteKey: string,
  ): Promise<CurrencyValueDto> {
    if (!indicatorRecord) {
      throw new NotFoundException(
        this.i18n.t('indicators.INDICATOR_NOT_FOUND', {
          args: { indicator: indicator },
        }),
      );
    }
    return new CurrencyValueDto(
      new Date(indicatorRecord.date),
      indicatorRecord.value,
      indicatorRecord.value_to_word,
      this.i18n.t(noteKey),
    );
  }

  async retrieveDetailsCurrencyIndicator(currency: IndicatorsEnum): Promise<CurrenciesResponseDto> {
    const currentValue = await this.repository.findCurrentOrLastDayRecord(currency);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(currency, currentValue?.date ?? new Date());
    const average = await this.repository.calculateAverageValueOfMonth(currency, currentValue?.date ?? new Date());

    const current = await this.getCurrencyValueDto(currentValue, currency, 'indicators.CURRENT_VALUE_NOTE');
    const first = await this.getCurrencyValueDto(firstIndicator, currency, 'indicators.FIRST_DAY_MONTH_NOTE');

    return new CurrenciesResponseDto({
      currency,
      average: average,
      data: [current, first],
    });
  }
}

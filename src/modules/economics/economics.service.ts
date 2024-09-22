import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicRepository } from '@modules/economics/repositories/economic.repository.interface';
import { IndicatorsRecord } from '@common/interfaces/indicators-record.interface';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';
import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { EconomicResponseDto } from '@modules/economics/dto/economic-response.dto';

@Injectable()
export class EconomicsService {
  constructor(
    @Inject('EconomicRepository') private readonly repository: EconomicRepository,
    private readonly i18n: I18nService,
  ) {}

  private async getIndicatorValueDto(
    indicatorRecord: IndicatorsRecord | null,
    indicator: string,
    noteKey: string,
  ): Promise<IndicatorValueDto> {
    if (!indicatorRecord) {
      throw new NotFoundException(
        this.i18n.t('indicators.INDICATOR_NOT_FOUND', {
          args: { indicator: indicator },
        }),
      );
    }
    return new IndicatorValueDto(
      new Date(indicatorRecord.date),
      indicatorRecord.value,
      indicatorRecord.value_to_word,
      this.i18n.t(noteKey),
    );
  }

  async retrieveDetailsIPCIndicator(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const accumulatedYearly = await this.repository.calculateAccumulatedValueLast12Months(indicator);
    const accumulated = await this.repository.calculateYearlyAccumulatedValue(indicator);

    const current = await this.getIndicatorValueDto(currentIndicator, indicator, 'indicators.CURRENT_VALUE_NOTE');

    return new EconomicResponseDto({
      indicator,
      accumulated,
      accumulatedYearly,
      records: [current],
    });
  }

  async retrieveDetailsUFIndicator(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const currentValue = await this.repository.findCurrentOrLastDayRecord(indicator);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(indicator, currentValue?.date ?? new Date());
    const average = await this.repository.calculateAverageValueOfMonth(indicator, currentValue?.date ?? new Date());
    const lastIndicator = await this.repository.findLastRecordOfMonth(indicator, currentValue?.date ?? new Date());

    const current = await this.getIndicatorValueDto(currentValue, indicator, 'indicators.CURRENT_VALUE_NOTE');
    const first = await this.getIndicatorValueDto(firstIndicator, indicator, 'indicators.FIRST_DAY_MONTH_NOTE');
    const last = await this.getIndicatorValueDto(lastIndicator, indicator, 'indicators.LAST_RECORD_VALUE_NOTE');

    return new EconomicResponseDto({
      indicator,
      average: average,
      records: [current, first, last],
    });
  }

  async retrieveDetailsUTMIndicator(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const current = await this.getIndicatorValueDto(currentIndicator, indicator, 'indicators.CURRENT_VALUE_NOTE');

    return new EconomicResponseDto({
      indicator,
      records: [current],
    });
  }
}

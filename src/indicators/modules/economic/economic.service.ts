import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicRepository } from './economic.repository';
import { IndicatorRecord } from '../../interfaces/indicator-record.interface';
import { IndicatorValueDto } from '../../dto/indicator-value.dto';
import { EconomicEnum } from './economic.enum';
import { IndicatorResponseDto } from '../../dto/indicator-response.dto';

@Injectable()
export class EconomicService {
  constructor(
    private readonly repository: EconomicRepository,
    private readonly i18n: I18nService,
  ) {}

  private async getIndicatorValueDto(
    indicatorRecord: IndicatorRecord | null,
    noteKey: string,
  ): Promise<IndicatorValueDto> {
    if (!indicatorRecord) {
      throw new NotFoundException(
        this.i18n.t('indicators.INDICATOR_NOT_FOUND', {
          args: { indicator: indicatorRecord },
        }),
      );
    }
    return new IndicatorValueDto(
      indicatorRecord.value,
      new Date(indicatorRecord.date),
      indicatorRecord.value_to_word,
      this.i18n.t(noteKey),
    );
  }

  async retrieveDetailsIPCIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const accumulatedYearly = await this.repository.calculateAccumulatedValueLast12Months(indicator);
    const accumulated = await this.repository.calculateYearlyAccumulatedValue(indicator);

    const current = await this.getIndicatorValueDto(currentIndicator, 'indicators.CURRENT_VALUE_NOTE');

    if (!current) {
      throw new NotFoundException(this.i18n.t('indicators.INDICATOR_NOT_FOUND', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [current],
      accumulated,
      accumulatedYearly,
    });
  }

  async retrieveDetailsUFIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(indicator);
    const average = await this.repository.calculateAverageValueOfMonth(indicator);
    const lastIndicator = await this.repository.findLastRecordOfMonth(indicator);

    const current = await this.getIndicatorValueDto(currentIndicator, 'indicators.CURRENT_VALUE_NOTE');
    const first = await this.getIndicatorValueDto(firstIndicator, 'indicators.FIRST_DAY_MONTH_NOTE');
    const last = await this.getIndicatorValueDto(lastIndicator, 'indicators.LAST_RECORD_VALUE_NOTE');

    if (!current || !first || !last) {
      throw new NotFoundException(this.i18n.t('indicators.INDICATOR_NOT_FOUND', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [current, first, last],
      average: average,
    });
  }

  async findCurrentIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const current = await this.getIndicatorValueDto(currentIndicator, 'indicators.CURRENT_VALUE_NOTE');
    if (!current) {
      throw new NotFoundException(this.i18n.t('indicators.INDICATOR_NOT_FOUND', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [current],
    });
  }
}

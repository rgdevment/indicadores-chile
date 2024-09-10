import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { EconomicRepository } from './economic.repository';
import { IndicatorsRecord } from '../../interfaces/indicators-record.interface';
import { IndicatorsValueDto } from '../../dto/indicators-value.dto';
import { IndicatorsResponseDto } from '../../dto/indicators-response.dto';
import { IndicatorsEnum } from '../indicators.enum';

@Injectable()
export class EconomicService {
  constructor(
    private readonly repository: EconomicRepository,
    private readonly i18n: I18nService,
  ) {}

  private async getIndicatorValueDto(
    indicatorRecord: IndicatorsRecord | null,
    indicator: string,
    noteKey: string,
  ): Promise<IndicatorsValueDto> {
    if (!indicatorRecord) {
      throw new NotFoundException(
        this.i18n.t('indicators.INDICATOR_NOT_FOUND', {
          args: { indicator: indicator },
        }),
      );
    }
    return new IndicatorsValueDto(
      indicatorRecord.value,
      new Date(indicatorRecord.date),
      indicatorRecord.value_to_word,
      this.i18n.t(noteKey),
    );
  }

  async retrieveDetailsIPCIndicator(indicator: IndicatorsEnum): Promise<IndicatorsResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const accumulatedYearly = await this.repository.calculateAccumulatedValueLast12Months(indicator);
    const accumulated = await this.repository.calculateYearlyAccumulatedValue(indicator);

    const current = await this.getIndicatorValueDto(currentIndicator, indicator, 'indicators.CURRENT_VALUE_NOTE');

    return new IndicatorsResponseDto({
      indicator,
      data: [current],
      accumulated,
      accumulatedYearly,
    });
  }

  async retrieveDetailsUFIndicator(indicator: IndicatorsEnum): Promise<IndicatorsResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(indicator, currentIndicator?.date ?? undefined);
    const average = await this.repository.calculateAverageValueOfMonth(indicator, currentIndicator?.date ?? undefined);
    const lastIndicator = await this.repository.findLastRecordOfMonth(indicator, currentIndicator?.date ?? undefined);

    const current = await this.getIndicatorValueDto(currentIndicator, indicator, 'indicators.CURRENT_VALUE_NOTE');
    const first = await this.getIndicatorValueDto(firstIndicator, indicator, 'indicators.FIRST_DAY_MONTH_NOTE');
    const last = await this.getIndicatorValueDto(lastIndicator, indicator, 'indicators.LAST_RECORD_VALUE_NOTE');

    return new IndicatorsResponseDto({
      indicator,
      data: [current, first, last],
      average: average,
    });
  }

  async findCurrentIndicator(indicator: IndicatorsEnum): Promise<IndicatorsResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const current = await this.getIndicatorValueDto(currentIndicator, indicator, 'indicators.CURRENT_VALUE_NOTE');

    return new IndicatorsResponseDto({
      indicator,
      data: [current],
    });
  }
}

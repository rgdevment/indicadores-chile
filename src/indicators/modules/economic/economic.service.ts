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
        this.i18n.t('indicators.indicatorNotFound', {
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

  private async getIndicatorDetails(indicator: EconomicEnum): Promise<{
    current: IndicatorValueDto;
    first?: IndicatorValueDto;
    last?: IndicatorValueDto;
    average?: number;
    accumulated?: number;
    accumulatedYearly?: number;
  }> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(indicator);
    const average = await this.repository.calculateAverageValueOfMonth(indicator);
    const lastIndicator = await this.repository.findLastRecordOfMonth(indicator);
    const accumulatedYearly = await this.repository.calculateAccumulatedValueLast12Months(indicator);
    const accumulated = await this.repository.calculateYearlyAccumulatedValue(indicator);

    return {
      current: await this.getIndicatorValueDto(currentIndicator, 'indicators.currentValueNote'),
      first: firstIndicator
        ? await this.getIndicatorValueDto(firstIndicator, 'indicators.firstDayOfMonthNote')
        : undefined,
      last: lastIndicator
        ? await this.getIndicatorValueDto(lastIndicator, 'indicators.lastRecordedValueNote')
        : undefined,
      average,
      accumulated,
      accumulatedYearly,
    };
  }

  async retrieveDetailsIPCIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const details = await this.getIndicatorDetails(indicator);
    if (!details.current) {
      throw new NotFoundException(this.i18n.t('indicators.indicatorNotFound', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [details.current],
      accumulated: details.accumulated,
      accumulatedYearly: details.accumulatedYearly,
    });
  }

  async retrieveDetailsUFIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const details = await this.getIndicatorDetails(indicator);
    if (!details.current || !details.first || !details.last) {
      throw new NotFoundException(this.i18n.t('indicators.indicatorNotFound', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [details.current, details.first, details.last],
      average: details.average,
    });
  }

  async findCurrentIndicator(indicator: EconomicEnum): Promise<IndicatorResponseDto> {
    const details = await this.getIndicatorDetails(indicator);
    if (!details.current) {
      throw new NotFoundException(this.i18n.t('indicators.indicatorNotFound', { args: { indicator } }));
    }

    return new IndicatorResponseDto({
      indicator,
      data: [details.current],
    });
  }
}

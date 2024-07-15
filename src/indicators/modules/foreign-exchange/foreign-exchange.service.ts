import { Injectable, NotFoundException } from '@nestjs/common';
import { IndicatorsResponseDto } from '../../dto/indicators-response.dto';
import { I18nService } from 'nestjs-i18n';
import { ForeignExchangeRepository } from './foreign-exchange.repository';
import { IndicatorsRecord } from '../../interfaces/indicators-record.interface';
import { IndicatorsValueDto } from '../../dto/indicators-value.dto';
import { IndicatorsEnum } from '../indicators.enum';

@Injectable()
export class ForeignExchangeService {
  constructor(
    private readonly repository: ForeignExchangeRepository,
    private readonly i18n: I18nService,
  ) {}

  private async getIndicatorValueDto(
    indicatorRecord: IndicatorsRecord | null,
    noteKey: string,
  ): Promise<IndicatorsValueDto> {
    if (!indicatorRecord) {
      throw new NotFoundException(
        this.i18n.t('indicators.INDICATOR_NOT_FOUND', {
          args: { indicator: indicatorRecord },
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

  async retrieveDetailsFxIndicator(indicator: IndicatorsEnum): Promise<IndicatorsResponseDto> {
    const currentIndicator = await this.repository.findCurrentOrLastDayRecord(indicator);
    const firstIndicator = await this.repository.findFirstRecordOfMonth(indicator);
    const average = await this.repository.calculateAverageValueOfMonth(indicator);

    const current = await this.getIndicatorValueDto(currentIndicator, 'indicators.CURRENT_VALUE_NOTE');
    const first = await this.getIndicatorValueDto(firstIndicator, 'indicators.FIRST_DAY_MONTH_NOTE');

    if (!current || !first) {
      throw new NotFoundException(this.i18n.t('indicators.INDICATOR_NOT_FOUND', { args: { indicator } }));
    }

    return new IndicatorsResponseDto({
      indicator,
      data: [current, first],
      average: average,
    });
  }
}

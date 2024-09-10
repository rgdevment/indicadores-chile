import { IndicatorsEnum } from '@modules/indicators.enum';

export interface BaseRepositoryInterface<T> {
  findCurrentOrLastDayRecord(indicator: IndicatorsEnum): Promise<T>;

  findFirstRecordOfMonth(indicator: IndicatorsEnum): Promise<T>;

  calculateAverageValueOfMonth(indicator: IndicatorsEnum): Promise<number>;

  findLastRecordOfMonth(indicator: IndicatorsEnum): Promise<T>;

  calculateAccumulatedValueLast12Months(indicator: IndicatorsEnum): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: IndicatorsEnum): Promise<number>;
}

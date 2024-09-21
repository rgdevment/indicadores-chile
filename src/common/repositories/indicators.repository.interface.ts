import { IndicatorsEnum } from '../enums/indicators.enum';

export interface IndicatorsRepositoryInterface<T> {
  findCurrentOrLastDayRecord(indicator: IndicatorsEnum): Promise<T>;

  findFirstRecordOfMonth(indicator: IndicatorsEnum, now?: Date): Promise<T>;

  calculateAverageValueOfMonth(indicator: IndicatorsEnum, date?: Date): Promise<number>;

  findLastRecordOfMonth(indicator: IndicatorsEnum): Promise<T>;

  calculateAccumulatedValueLast12Months(indicator: IndicatorsEnum): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: IndicatorsEnum): Promise<number>;
}

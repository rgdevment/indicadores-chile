import { IndicatorsType } from '../types/indicators.type';

export interface IndicatorsRepositoryInterface<T> {
  findCurrentOrLastDayRecord(indicator: IndicatorsType): Promise<T>;

  findFirstRecordOfMonth(indicator: IndicatorsType, now?: Date): Promise<T>;

  calculateAverageValueOfMonth(indicator: IndicatorsType, date?: Date): Promise<number>;

  findLastRecordOfMonth(indicator: IndicatorsType, date?: Date): Promise<T>;

  calculateAccumulatedValueLast12Months(indicator: IndicatorsType): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: IndicatorsType): Promise<number>;
}

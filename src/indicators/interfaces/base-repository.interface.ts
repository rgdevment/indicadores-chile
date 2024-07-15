export interface BaseRepositoryInterface<T> {
  findCurrentOrLastDayRecord(indicator: string): Promise<T>;

  findFirstRecordOfMonth(indicator: string): Promise<T>;

  calculateAverageValueOfMonth(indicator: string): Promise<number>;

  findLastRecordOfMonth(indicator: string): Promise<T>;

  calculateAccumulatedValueLast12Months(indicator: string): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: string): Promise<number>;
}

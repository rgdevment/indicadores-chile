import { EconomicEnum } from '../economic.enum';
import { Economic } from '../schemas/economic.schema';

export interface EconomicRepositoryInterface {
  findCurrentOrLastDayRecord(indicator: EconomicEnum): Promise<Economic>;

  findFirstRecordOfMonth(indicator: EconomicEnum): Promise<Economic>;

  calculateAverageValueOfMonth(indicator: EconomicEnum): Promise<number>;

  findLastRecordOfMonth(indicator: EconomicEnum): Promise<Economic>;

  calculateAccumulatedValueLast12Months(indicator: EconomicEnum): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: EconomicEnum): Promise<number>;
}

import { EconomicEnum } from '../economic.enum';
import { BaseRepositoryInterface } from '../../../interfaces/base-repository.interface';
import { EconomicDocument } from './economic.interface';

export interface EconomicRepositoryInterface extends BaseRepositoryInterface<EconomicDocument> {
  findCurrentOrLastDayRecord(indicator: EconomicEnum): Promise<EconomicDocument>;

  findFirstRecordOfMonth(indicator: EconomicEnum): Promise<EconomicDocument>;

  calculateAverageValueOfMonth(indicator: EconomicEnum): Promise<number>;

  findLastRecordOfMonth(indicator: EconomicEnum): Promise<EconomicDocument>;

  calculateAccumulatedValueLast12Months(indicator: EconomicEnum): Promise<number>;

  calculateYearlyAccumulatedValue(indicator: EconomicEnum): Promise<number>;
}

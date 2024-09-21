import { CurrencyDocument } from '@modules/currencies/schemas/currency.document.interface';
import { IndicatorsRepositoryInterface } from '../../../common/repositories/indicators.repository.interface';

export interface CurrencyRepository extends IndicatorsRepositoryInterface<CurrencyDocument> {}

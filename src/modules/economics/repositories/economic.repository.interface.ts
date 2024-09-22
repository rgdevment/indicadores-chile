import { IndicatorsRepositoryInterface } from '@common/repositories/indicators.repository.interface';
import { EconomicDocument } from '@modules/economics/schemas/economic.document.interface';

export interface EconomicRepository extends IndicatorsRepositoryInterface<EconomicDocument> {}

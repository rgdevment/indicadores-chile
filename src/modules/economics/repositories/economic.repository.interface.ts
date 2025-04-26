import type { IndicatorsRepositoryInterface } from '@common/repositories/indicators.repository.interface';
import type { EconomicDocument } from '@modules/economics/schemas/economic.document.interface';

export interface EconomicRepository extends IndicatorsRepositoryInterface<EconomicDocument> {}

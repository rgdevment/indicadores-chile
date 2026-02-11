import { IndicatorQueryService } from '@common/services/indicator-query.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CurrencyRepository extends IndicatorQueryService {}

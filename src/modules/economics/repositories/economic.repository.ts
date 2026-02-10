import { IndicatorQueryService } from '@common/services/indicator-query.service';
import { IndicatorValueEntity } from '@entities/indicator-value.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class EconomicRepository extends IndicatorQueryService {
  constructor(
    @InjectRepository(IndicatorValueEntity)
    repo: Repository<IndicatorValueEntity>,
  ) {
    super(repo);
  }
}

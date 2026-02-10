import { AfpEntity } from '@entities/afp.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AfpEnum } from '../enums/afp.enum';

@Injectable()
export class AfpRepository {
  constructor(
    @InjectRepository(AfpEntity)
    private readonly repo: Repository<AfpEntity>,
  ) {}

  /**
   * Obtiene los registros más recientes de una AFP, agrupados por category + sub_category.
   * Equivale al pipeline de aggregation de Mongo original.
   */
  async findLatestByAfp(afpName: AfpEnum): Promise<AfpEntity[]> {
    // Subquery: fecha más reciente por category+sub_category
    const subQuery = this.repo
      .createQueryBuilder('sub')
      .select('sub.category')
      .addSelect('sub.sub_category')
      .addSelect('MAX(sub.recorded_date)', 'max_date')
      .where('sub.name = :name')
      .groupBy('sub.category')
      .addGroupBy('sub.sub_category');

    return this.repo
      .createQueryBuilder('a')
      .innerJoin(
        `(${subQuery.getQuery()})`,
        'latest',
        'a.category = latest.sub_category AND a.sub_category = latest.sub_sub_category AND a.recorded_date = latest.max_date',
      )
      .where('a.name = :name', { name: afpName })
      .orderBy('a.category', 'ASC')
      .addOrderBy('a.sub_category', 'ASC')
      .getMany();
  }

  /** Alternativa simplificada: obtiene el último registro por cada category/sub_category */
  async findLatest(afpName: AfpEnum): Promise<AfpEntity[]> {
    const raw = await this.repo
      .createQueryBuilder('a')
      .where('a.name = :name', { name: afpName })
      .andWhere(
        `a.recorded_date = (
          SELECT MAX(a2.recorded_date) FROM afp_commissions a2
          WHERE a2.name = a.name AND a2.category = a.category
          AND (a2.sub_category = a.sub_category OR (a2.sub_category IS NULL AND a.sub_category IS NULL))
        )`,
      )
      .orderBy('a.category', 'ASC')
      .addOrderBy('a.sub_category', 'ASC')
      .getMany();

    return raw;
  }
}

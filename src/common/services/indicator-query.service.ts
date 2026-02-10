import { IndicatorValueEntity } from '@entities/indicator-value.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

export interface IndicatorQueryResult {
  value: number;
  recorded_date: string;
  value_to_word?: string;
}

@Injectable()
export class IndicatorQueryService {
  constructor(private readonly repo: Repository<IndicatorValueEntity>) {}

  /** Último registro disponible para un subtipo */
  async findLatestRecord(subtypeCode: string): Promise<IndicatorValueEntity | null> {
    return this.repo.findOne({
      where: { subtype: { code: subtypeCode } },
      order: { recorded_date: 'DESC' },
    });
  }

  /** Primer registro del mes actual */
  async findFirstOfMonth(subtypeCode: string, date: Date = new Date()): Promise<IndicatorValueEntity | null> {
    const startOfMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    return this.repo
      .createQueryBuilder('v')
      .innerJoin('v.subtype', 's')
      .where('s.code = :code', { code: subtypeCode })
      .andWhere('v.recorded_date >= :start', { start: startOfMonth })
      .orderBy('v.recorded_date', 'ASC')
      .getOne();
  }

  /** Último registro del mes actual */
  async findLastOfMonth(subtypeCode: string, date: Date = new Date()): Promise<IndicatorValueEntity | null> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const startOfNext = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`;

    return this.repo
      .createQueryBuilder('v')
      .innerJoin('v.subtype', 's')
      .where('s.code = :code', { code: subtypeCode })
      .andWhere('v.recorded_date >= :start', { start: startOfMonth })
      .andWhere('v.recorded_date < :end', { end: startOfNext })
      .orderBy('v.recorded_date', 'DESC')
      .getOne();
  }

  /** Promedio del mes actual */
  async averageOfMonth(subtypeCode: string, date: Date = new Date()): Promise<number | null> {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startOfMonth = `${year}-${String(month).padStart(2, '0')}-01`;
    const startOfNext = month === 12 ? `${year + 1}-01-01` : `${year}-${String(month + 1).padStart(2, '0')}-01`;

    const result = await this.repo
      .createQueryBuilder('v')
      .innerJoin('v.subtype', 's')
      .select('AVG(v.value)', 'avg')
      .where('s.code = :code', { code: subtypeCode })
      .andWhere('v.recorded_date >= :start', { start: startOfMonth })
      .andWhere('v.recorded_date < :end', { end: startOfNext })
      .getRawOne();

    return result?.avg ? Number(result.avg) : null;
  }

  /** Acumulado últimos 12 meses (suma de valores) */
  async accumulatedLast12Months(subtypeCode: string): Promise<number | null> {
    const now = new Date();
    const yearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    const start = yearAgo.toISOString().slice(0, 10);

    const result = await this.repo
      .createQueryBuilder('v')
      .innerJoin('v.subtype', 's')
      .select('SUM(v.value)', 'total')
      .where('s.code = :code', { code: subtypeCode })
      .andWhere('v.recorded_date >= :start', { start })
      .getRawOne();

    return result?.total ? Number(result.total) : null;
  }

  /** Acumulado año en curso */
  async accumulatedCurrentYear(subtypeCode: string): Promise<number | null> {
    const startOfYear = `${new Date().getFullYear()}-01-01`;

    const result = await this.repo
      .createQueryBuilder('v')
      .innerJoin('v.subtype', 's')
      .select('SUM(v.value)', 'total')
      .where('s.code = :code', { code: subtypeCode })
      .andWhere('v.recorded_date >= :start', { start: startOfYear })
      .getRawOne();

    return result?.total ? Number(result.total) : null;
  }
}

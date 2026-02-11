import { KYSELY } from '@database/database.module';
import { Database, IndicatorValue } from '@database/database.types';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class IndicatorQueryService {
  constructor(@Inject(KYSELY) protected readonly db: Kysely<Database>) {}

  async findLatestRecord(subtypeCode: string): Promise<IndicatorValue | undefined> {
    return this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .selectAll('v')
      .where('s.code', '=', subtypeCode)
      .orderBy('v.recorded_date', 'desc')
      .limit(1)
      .executeTakeFirst();
  }

  async findFirstOfMonth(subtypeCode: string, date = new Date()): Promise<IndicatorValue | undefined> {
    const start = this.monthStart(date);
    return this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .selectAll('v')
      .where('s.code', '=', subtypeCode)
      .where('v.recorded_date', '>=', start)
      .orderBy('v.recorded_date', 'asc')
      .limit(1)
      .executeTakeFirst();
  }

  async findLastOfMonth(subtypeCode: string, date = new Date()): Promise<IndicatorValue | undefined> {
    const [start, end] = this.monthRange(date);
    return this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .selectAll('v')
      .where('s.code', '=', subtypeCode)
      .where('v.recorded_date', '>=', start)
      .where('v.recorded_date', '<', end)
      .orderBy('v.recorded_date', 'desc')
      .limit(1)
      .executeTakeFirst();
  }

  async averageOfMonth(subtypeCode: string, date = new Date()): Promise<number | null> {
    const [start, end] = this.monthRange(date);
    const row = await this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .select(eb => eb.fn.avg<number>('v.value').as('avg'))
      .where('s.code', '=', subtypeCode)
      .where('v.recorded_date', '>=', start)
      .where('v.recorded_date', '<', end)
      .executeTakeFirst();
    return row?.avg ?? null;
  }

  async accumulatedLast12Months(subtypeCode: string): Promise<number | null> {
    const now = new Date();
    const start = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()).toISOString().slice(0, 10);
    const row = await this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .select(eb => eb.fn.sum<number>('v.value').as('total'))
      .where('s.code', '=', subtypeCode)
      .where('v.recorded_date', '>=', start)
      .executeTakeFirst();
    return row?.total ?? null;
  }

  async accumulatedCurrentYear(subtypeCode: string): Promise<number | null> {
    const start = `${new Date().getFullYear()}-01-01`;
    const row = await this.db
      .selectFrom('indicator_values as v')
      .innerJoin('indicator_subtypes as s', 's.id', 'v.subtype_id')
      .select(eb => eb.fn.sum<number>('v.value').as('total'))
      .where('s.code', '=', subtypeCode)
      .where('v.recorded_date', '>=', start)
      .executeTakeFirst();
    return row?.total ?? null;
  }

  /* ─── helpers ──────────────────────────────────────── */

  private monthStart(d: Date): string {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
  }

  private monthRange(d: Date): [string, string] {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const start = `${y}-${String(m).padStart(2, '0')}-01`;
    const end = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`;
    return [start, end];
  }
}

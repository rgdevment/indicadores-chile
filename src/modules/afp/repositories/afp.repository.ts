import { KYSELY } from '@database/database.module';
import { AfpCommission, Database } from '@database/database.types';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely, sql } from 'kysely';
import { AfpEnum } from '../enums/afp.enum';

@Injectable()
export class AfpRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<Database>) {}

  async findLatest(afpName: AfpEnum): Promise<AfpCommission[]> {
    const { rows } = await sql<AfpCommission>`
      SELECT * FROM afp_commissions a
      WHERE a.name = ${afpName}
        AND a.recorded_date = (
          SELECT MAX(a2.recorded_date) FROM afp_commissions a2
          WHERE a2.name = a.name
            AND a2.category = a.category
            AND (a2.sub_category = a.sub_category
              OR (a2.sub_category IS NULL AND a.sub_category IS NULL))
        )
      ORDER BY a.category, a.sub_category
    `.execute(this.db);
    return rows;
  }
}

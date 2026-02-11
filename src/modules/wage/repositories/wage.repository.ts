import { KYSELY } from '@database/database.module';
import { Database, MinimumWage } from '@database/database.types';
import { Inject, Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';

@Injectable()
export class WageRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<Database>) {}

  async findAll(): Promise<MinimumWage[]> {
    return this.db.selectFrom('minimum_wages').selectAll().orderBy('recorded_date', 'desc').execute();
  }
}

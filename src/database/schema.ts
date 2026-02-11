import { Kysely, sql } from 'kysely';
import { Database } from './database.types';

/**
 * Creates all tables if they don't exist.
 * Idempotent — safe to run on every startup.
 */
export async function createSchema(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('indicator_types')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement())
    .addColumn('code', 'text', c => c.notNull().unique())
    .addColumn('name', 'text', c => c.notNull())
    .execute();

  await db.schema
    .createTable('indicator_subtypes')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement())
    .addColumn('type_id', 'integer', c => c.notNull().references('indicator_types.id'))
    .addColumn('code', 'text', c => c.notNull())
    .addColumn('name', 'text', c => c.notNull())
    .execute();

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_subtypes_type_code ON indicator_subtypes(type_id, code)`.execute(db);

  await db.schema
    .createTable('indicator_values')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement())
    .addColumn('subtype_id', 'integer', c => c.notNull().references('indicator_subtypes.id'))
    .addColumn('value', 'real', c => c.notNull())
    .addColumn('value_to_word', 'text')
    .addColumn('unit', 'text', c => c.notNull().defaultTo('CLP'))
    .addColumn('source', 'text')
    .addColumn('recorded_date', 'text', c => c.notNull())
    .addColumn('created_at', 'text', c => c.notNull().defaultTo(sql`(datetime('now'))`))
    .execute();

  await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_values_subtype_date ON indicator_values(subtype_id, recorded_date)`.execute(
    db,
  );

  await db.schema
    .createTable('afp_commissions')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement())
    .addColumn('name', 'text', c => c.notNull())
    .addColumn('category', 'text', c => c.notNull())
    .addColumn('sub_category', 'text')
    .addColumn('commission', 'real')
    .addColumn('recorded_date', 'text', c => c.notNull())
    .addColumn('created_at', 'text', c => c.notNull().defaultTo(sql`(datetime('now'))`))
    .execute();

  await db.schema
    .createTable('minimum_wages')
    .ifNotExists()
    .addColumn('id', 'integer', c => c.primaryKey().autoIncrement())
    .addColumn('salary', 'real', c => c.notNull())
    .addColumn('value_to_word', 'text')
    .addColumn('range', 'text')
    .addColumn('law', 'text')
    .addColumn('recorded_date', 'text', c => c.notNull())
    .addColumn('created_at', 'text', c => c.notNull().defaultTo(sql`(datetime('now'))`))
    .execute();
}

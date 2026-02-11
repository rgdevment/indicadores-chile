import { Generated, Selectable } from 'kysely';

/* ─── Tables ─────────────────────────────────────────── */

export interface IndicatorTypeTable {
  id: Generated<number>;
  code: string;
  name: string;
}

export interface IndicatorSubtypeTable {
  id: Generated<number>;
  type_id: number;
  code: string;
  name: string;
}

export interface IndicatorValueTable {
  id: Generated<number>;
  subtype_id: number;
  value: number;
  value_to_word: string | null;
  unit: string;
  source: string | null;
  recorded_date: string;
  created_at: Generated<string>;
}

export interface AfpCommissionTable {
  id: Generated<number>;
  name: string;
  category: string;
  sub_category: string | null;
  commission: number | null;
  recorded_date: string;
  created_at: Generated<string>;
}

export interface MinimumWageTable {
  id: Generated<number>;
  salary: number;
  value_to_word: string | null;
  range: string | null;
  law: string | null;
  recorded_date: string;
  created_at: Generated<string>;
}

/* ─── Database schema ────────────────────────────────── */

export interface Database {
  indicator_types: IndicatorTypeTable;
  indicator_subtypes: IndicatorSubtypeTable;
  indicator_values: IndicatorValueTable;
  afp_commissions: AfpCommissionTable;
  minimum_wages: MinimumWageTable;
}

/* ─── Row types (select result) ──────────────────────── */

export type IndicatorType = Selectable<IndicatorTypeTable>;
export type IndicatorSubtype = Selectable<IndicatorSubtypeTable>;
export type IndicatorValue = Selectable<IndicatorValueTable>;
export type AfpCommission = Selectable<AfpCommissionTable>;
export type MinimumWage = Selectable<MinimumWageTable>;

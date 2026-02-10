import { AfpEntity } from '@entities/afp.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AfpResponseDto } from './dto/afp-response.dto';
import { AfpEnum } from './enums/afp.enum';
import { AfpRepository } from './repositories/afp.repository';

type FieldKey = 'quota' | 'mandatory' | 'voluntaryPension' | 'voluntarySavings';

interface FieldMapping {
  field: FieldKey;
  sub: string;
}

const FIELD_MAP: Record<string, FieldMapping> = {
  'Cotizacion obligatoria|Cotizacion (Depositos)': {
    field: 'quota',
    sub: 'deposit',
  },
  'Cotizacion obligatoria|Retiros': { field: 'quota', sub: 'withdrawals' },
  'Cotizacion obligatoria|Traspasos': { field: 'quota', sub: 'transfer' },
  'Comision obligatoria|Cotizacion (Depositos)': {
    field: 'mandatory',
    sub: 'deposit',
  },
  'Comision obligatoria|Retiros': { field: 'mandatory', sub: 'withdrawals' },
  'Comision obligatoria|Traspasos': { field: 'mandatory', sub: 'transfer' },
  'APV|Afiliados': { field: 'voluntaryPension', sub: 'affiliated' },
  'APV|No Afiliados': { field: 'voluntaryPension', sub: 'nonAffiliated' },
  'APV|Traspasos': { field: 'voluntaryPension', sub: 'transfer' },
  'Cuenta de Ahorro Voluntario|Afiliados': {
    field: 'voluntarySavings',
    sub: 'affiliated',
  },
};

@Injectable()
export class AfpService {
  constructor(private readonly repository: AfpRepository) {}

  async getCommissions(afpName: AfpEnum): Promise<AfpResponseDto> {
    const records = await this.repository.findLatest(afpName);

    if (!records.length) {
      throw new NotFoundException('No se encontro informacion para la AFP ' + afpName);
    }

    const dto: AfpResponseDto = { name: afpName };

    for (const record of records) {
      this.mapRecordToDto(record, dto);
    }

    return dto;
  }

  private mapRecordToDto(record: AfpEntity, dto: AfpResponseDto): void {
    const rawKey = record.category + '|' + (record.sub_category ?? '');
    const key = this.normalizeKey(rawKey);
    const mapping = FIELD_MAP[key];

    if (!mapping) return;

    const value = this.parseCommission(record.commission);
    const field = mapping.field;

    if (!dto[field]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dto as any)[field] = {};
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (dto[field] as any)[mapping.sub] = value;
  }

  /** Strip diacritics so accented DB values match the map keys */
  private normalizeKey(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private parseCommission(value: number | string | null | undefined): number | undefined {
    if (value === null || value === undefined) return undefined;
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return isNaN(num) ? undefined : num;
  }
}

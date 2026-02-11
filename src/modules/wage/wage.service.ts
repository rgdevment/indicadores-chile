import { MinimumWage } from '@database/database.types';
import { Injectable, NotFoundException } from '@nestjs/common';
import { WageEntryDto } from './dto/wage-entry.dto';
import { WageResponseDto } from './dto/wage-response.dto';
import { WageRepository } from './repositories/wage.repository';

@Injectable()
export class WageService {
  constructor(private readonly repository: WageRepository) {}

  async getMinimumWage(): Promise<WageResponseDto> {
    const wages = await this.repository.findAll();

    if (!wages.length) {
      throw new NotFoundException('No se encontró información de salario mínimo');
    }

    const toDto = (w: MinimumWage): WageEntryDto => ({
      amount: Number(w.salary),
      details: w.value_to_word ?? undefined,
      law: w.law ?? undefined,
      range: w.range ?? undefined,
      date: w.recorded_date,
    });

    const [current, ...historic] = wages;
    return { current: toDto(current), historic: historic.map(toDto) };
  }
}

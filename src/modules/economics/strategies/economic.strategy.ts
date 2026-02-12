import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { NotFoundException } from '@nestjs/common';
import { EconomicResponseDto } from '../dto/economic-response.dto';
import { EconomicRepository } from '../repositories/economic.repository';

export interface EconomicStrategy {
  resolve(indicator: string, repo: EconomicRepository): Promise<EconomicResponseDto>;
}

export class UfStrategy implements EconomicStrategy {
  async resolve(indicator: string, repo: EconomicRepository): Promise<EconomicResponseDto> {
    const [current, firstOfMonth, lastOfMonth, average] = await Promise.all([
      repo.findLatestRecord(indicator),
      repo.findFirstOfMonth(indicator),
      repo.findLastOfMonth(indicator),
      repo.averageOfMonth(indicator),
    ]);

    if (!current) {
      throw new NotFoundException('No se encontro informacion para ' + indicator);
    }

    const records: IndicatorValueDto[] = [
      IndicatorValueDto.fromEntity(current, 'Valor actualizado al dia de hoy, o del ultimo registro disponible.'),
    ];

    if (firstOfMonth) {
      records.push(IndicatorValueDto.fromEntity(firstOfMonth, 'Valor del primer dia del mes.'));
    }

    if (lastOfMonth) {
      records.push(
        IndicatorValueDto.fromEntity(
          lastOfMonth,
          'Valor del ultimo dia del mes, o el ultimo valor registrado en el mes.',
        ),
      );
    }

    return {
      indicator,
      average: average ? Math.round(average * 100) / 100 : undefined,
      records,
    };
  }
}

export class UtmStrategy implements EconomicStrategy {
  async resolve(indicator: string, repo: EconomicRepository): Promise<EconomicResponseDto> {
    const current = await repo.findLatestRecord(indicator);

    if (!current) {
      throw new NotFoundException('No se encontro informacion para ' + indicator);
    }

    return {
      indicator,
      records: [
        IndicatorValueDto.fromEntity(current, 'Valor actualizado al dia de hoy, o del ultimo registro disponible.'),
      ],
    };
  }
}

export class IpcStrategy implements EconomicStrategy {
  async resolve(indicator: string, repo: EconomicRepository): Promise<EconomicResponseDto> {
    const [current, accumulated, accumulatedYearly] = await Promise.all([
      repo.findLatestRecord(indicator),
      repo.accumulatedLast12Months(indicator),
      repo.accumulatedCurrentYear(indicator),
    ]);

    if (!current) {
      throw new NotFoundException('No se encontro informacion para ' + indicator);
    }

    return {
      indicator,
      accumulated: accumulated ? Math.round(accumulated * 100) / 100 : undefined,
      accumulatedYearly: accumulatedYearly ? Math.round(accumulatedYearly * 100) / 100 : undefined,
      records: [
        IndicatorValueDto.fromEntity(current, 'Valor actualizado al dia de hoy, o del ultimo registro disponible.'),
      ],
    };
  }
}

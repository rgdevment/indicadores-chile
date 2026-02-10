import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrencyRepository } from './repositories/currency.repository';

@Injectable()
export class CurrenciesService {
  constructor(private readonly repository: CurrencyRepository) {}

  async getIndicator(currency: CurrenciesEnum): Promise<CurrencyResponseDto> {
    const [current, firstOfMonth, average] = await Promise.all([
      this.repository.findLatestRecord(currency),
      this.repository.findFirstOfMonth(currency),
      this.repository.averageOfMonth(currency),
    ]);

    if (!current) {
      throw new NotFoundException('No se encontro informacion para la divisa ' + currency);
    }

    const records: IndicatorValueDto[] = [
      IndicatorValueDto.fromEntity(current, 'Valor actualizado al dia de hoy, o del ultimo registro disponible.'),
    ];

    if (firstOfMonth) {
      records.push(IndicatorValueDto.fromEntity(firstOfMonth, 'Valor del primer dia del mes.'));
    }

    return {
      currency,
      average: average ? Math.round(average * 100) / 100 : undefined,
      records,
    };
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { EconomicResponseDto } from './dto/economic-response.dto';
import { EconomicsEnum } from './enums/economics.enum';
import { EconomicRepository } from './repositories/economic.repository';
import { EconomicStrategy, IpcStrategy, UfStrategy, UtmStrategy } from './strategies/economic.strategy';

@Injectable()
export class EconomicsService {
  private readonly strategies: Record<EconomicsEnum, EconomicStrategy> = {
    [EconomicsEnum.UF]: new UfStrategy(),
    [EconomicsEnum.UTM]: new UtmStrategy(),
    [EconomicsEnum.IPC]: new IpcStrategy(),
  };

  constructor(private readonly repository: EconomicRepository) {}

  async getIndicator(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const strategy = this.strategies[indicator];
    if (!strategy) {
      throw new NotFoundException('Estrategia no definida para ' + indicator);
    }
    return strategy.resolve(indicator, this.repository);
  }
}

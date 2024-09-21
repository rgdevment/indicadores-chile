import { Controller, Get, UseFilters } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from '@modules/currencies/currencies.service';
import { IndicatorsEnum } from '../../common/enums/indicators.enum';
import { GlobalExceptionFilter } from '../../common/filters/global-exception.filter';

@ApiTags('Currencies', 'Divisas')
@UseFilters(GlobalExceptionFilter)
@Controller()
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get('dolar')
  async getDollar() {
    return await this.service.retrieveDetailsCurrencyIndicator(IndicatorsEnum.DOLAR);
  }

  @Get('euro')
  async getEuro() {
    return await this.service.retrieveDetailsCurrencyIndicator(IndicatorsEnum.EURO);
  }
}

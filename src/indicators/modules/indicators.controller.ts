import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForeignExchangeService } from './foreign-exchange/foreign-exchange.service';
import { IndicatorsResponseDto } from '../dto/indicators-response.dto';
import { EconomicService } from './economic/economic.service';
import { IndicatorsEnum } from './indicators.enum';
import { IndicatorsParsePipe } from '../validators/indicators-parse.pipe';
import { GlobalExceptionFilter } from '../../common/filters/global-exception.filter';

@ApiTags('Indicadores')
@UseFilters(GlobalExceptionFilter)
@Controller('v1')
export class IndicatorsController {
  constructor(
    private readonly foreignExchangeService: ForeignExchangeService,
    private readonly economicService: EconomicService,
  ) {}

  @Get(':indicator')
  @ApiOperation({
    summary: 'Obtiene un indicador especifico.',
    description: 'Recopila y procesa información sobre el indicador solicitado.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: IndicatorsResponseDto })
  async getForeignExchange(@Param('indicator', IndicatorsParsePipe) indicator: IndicatorsEnum) {
    if (indicator === IndicatorsEnum.UF) {
      return await this.economicService.retrieveDetailsUFIndicator(indicator);
    } else if (indicator === IndicatorsEnum.IPC) {
      return await this.economicService.retrieveDetailsIPCIndicator(indicator);
    } else if (indicator === IndicatorsEnum.DOLAR || indicator === IndicatorsEnum.EURO) {
      return await this.foreignExchangeService.retrieveDetailsFxIndicator(indicator);
    }

    return await this.economicService.findCurrentIndicator(indicator);
  }
}

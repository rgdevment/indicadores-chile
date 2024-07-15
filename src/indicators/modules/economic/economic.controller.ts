import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../../common/filters/global-exception.filter';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndicatorResponseDto } from '../../dto/indicator-response.dto';
import { EconomicParsePipe } from './validators/economic-parse.pipe';
import { EconomicEnum } from './economic.enum';
import { EconomicService } from './economic.service';

@ApiTags('Indicadores')
@UseFilters(GlobalExceptionFilter)
@Controller()
export class EconomicController {
  constructor(private readonly service: EconomicService) {}

  @Get(':indicator')
  @ApiOperation({
    summary: 'Obtiene un indicador especifico.',
    description: 'Recopila y procesa información sobre el indicador solicitado.',
  })
  @ApiResponse({ status: 200, description: 'Success', type: IndicatorResponseDto })
  async getIndicator(@Param('indicator', EconomicParsePipe) indicator: EconomicEnum) {
    if (indicator === EconomicEnum.UF) {
      return await this.service.retrieveDetailsUFIndicator(indicator);
    } else if (indicator === EconomicEnum.IPC) {
      return await this.service.retrieveDetailsIPCIndicator(indicator);
    }

    return await this.service.findCurrentIndicator(indicator);
  }
}

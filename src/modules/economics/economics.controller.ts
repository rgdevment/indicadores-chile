import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { EconomicResponseDto } from './dto/economic-response.dto';
import { EconomicsService } from './economics.service';
import { EconomicsEnum } from './enums/economics.enum';
import { EconomicsParsePipe } from './validators/economics-parse.pipe';

@ApiTags('Economicos')
@Controller('economicos')
@UseInterceptors(CacheInterceptor)
export class EconomicsController {
  constructor(private readonly service: EconomicsService) {}

  @Get(':indicator')
  @CacheTTL(3600 * 1000)
  @ApiOperation({
    summary: 'Obtener indicador economico',
    description: 'Retorna datos segun la estrategia del indicador (UF, UTM, IPC).',
  })
  @ApiParam({
    name: 'indicator',
    enum: EconomicsEnum,
    description: 'Tipo de indicador',
  })
  @ApiOkResponse({ type: EconomicResponseDto })
  @ApiCommonErrors()
  getIndicator(@Param('indicator', EconomicsParsePipe) indicator: EconomicsEnum) {
    return this.service.getIndicator(indicator);
  }
}

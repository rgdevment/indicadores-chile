import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrenciesParsePipe } from './validators/currencies-parse.pipe';

@ApiTags('Divisas')
@Controller('divisas')
@UseInterceptors(CacheInterceptor)
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get(':currency')
  @CacheTTL(3600 * 1000)
  @ApiOperation({
    summary: 'Obtener indicador de divisa',
    description: 'Retorna el valor actual, primer dia del mes y promedio mensual.',
  })
  @ApiParam({
    name: 'currency',
    enum: CurrenciesEnum,
    description: 'Tipo de divisa',
  })
  @ApiOkResponse({ type: CurrencyResponseDto })
  @ApiCommonErrors()
  getIndicator(@Param('currency', CurrenciesParsePipe) currency: CurrenciesEnum) {
    return this.service.getIndicator(currency);
  }
}

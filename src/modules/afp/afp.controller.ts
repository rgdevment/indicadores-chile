import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AfpService } from './afp.service';
import { AfpResponseDto } from './dto/afp-response.dto';
import { AfpEnum } from './enums/afp.enum';
import { AfpParsePipe } from './validators/afp-parse.pipe';

@ApiTags('AFP')
@Controller('afp')
@UseInterceptors(CacheInterceptor)
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Get(':name')
  @CacheTTL(86400 * 1000)
  @ApiOperation({
    summary: 'Obtener comisiones AFP',
    description: 'Retorna las comisiones vigentes de la AFP indicada.',
  })
  @ApiParam({
    name: 'name',
    enum: AfpEnum,
    description: 'Nombre de la AFP',
  })
  @ApiOkResponse({ type: AfpResponseDto })
  @ApiCommonErrors()
  getCommissions(@Param('name', AfpParsePipe) name: AfpEnum) {
    return this.service.getCommissions(name);
  }
}

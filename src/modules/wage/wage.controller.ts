import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { WageResponseDto } from './dto/wage-response.dto';
import { WageService } from './wage.service';

@ApiTags('Salarios')
@Controller('salarios')
@UseInterceptors(CacheInterceptor)
export class WageController {
  constructor(private readonly service: WageService) {}

  @Get('minimo')
  @CacheTTL(86400 * 1000)
  @ApiOperation({ summary: 'Obtener salario mínimo', description: 'Retorna el salario mínimo vigente e historial.' })
  @ApiOkResponse({ type: WageResponseDto })
  getMinimumWage() {
    return this.service.getMinimumWage();
  }
}

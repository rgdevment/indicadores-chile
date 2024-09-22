import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { CurrencyResponseDto } from '@modules/currencies/dto/currency-response.dto';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';
import { EconomicsService } from '@modules/economics/economics.service';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';
import { EconomicsParsePipe } from '@modules/economics/validators/economics-parse.pipe';

@ApiTags('Económicos')
@UseFilters(GlobalExceptionFilter)
@Controller()
export class EconomicsController {
  constructor(private readonly service: EconomicsService) {}

  @Get(':indicator')
  @ApiOperation({
    summary: 'Obtiene el valor actual, promedio del mes, el primer y último registro del indicador económico.',
    description: `Devuelve el valor actual del indicador económico solicitado, junto con el promedio mensual y otros 
                  detalles sobre el primer y último valor registrado del mes.`,
  })
  @ApiParam({
    name: 'indicator',
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(CurrenciesEnum),
      example: 'UF',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Indicador económico encontrado y procesado exitosamente',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Indicador económico no válida o no soportada por la API.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          timestamp: '2024-09-22T02:26:46.808Z',
          path: '/v1/CHL',
          method: 'GET',
          message: 'CHL no es un indicador económico soportado por nuestra API.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Datos no encontrados para el indicador económico solicitado.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          timestamp: '2024-09-22T02:26:46.808Z',
          path: '/v1/uf',
          method: 'GET',
          message: 'No se encontraron registros para el indicador económico UF en el periodo solicitado.',
        },
      },
    },
  })
  async getIndicator(@Param('indicator', EconomicsParsePipe) indicator: EconomicsEnum) {
    if (indicator === EconomicsEnum.UF) {
      return await this.service.retrieveDetailsUFIndicator(indicator);
    } else if (indicator === EconomicsEnum.UTM) {
      return await this.service.retrieveDetailsUTMIndicator(indicator);
    } else {
      return await this.service.retrieveDetailsIPCIndicator(indicator);
    }
  }
}

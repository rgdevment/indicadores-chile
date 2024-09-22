import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from '@modules/currencies/currencies.service';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrenciesParsePipe } from '@modules/currencies/validators/currencies-parse.pipe';
import { CurrencyResponseDto } from '@modules/currencies/dto/currency-response.dto';

@ApiTags('Divisas')
@UseFilters(GlobalExceptionFilter)
@Controller('divisas')
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get(':currency')
  @ApiOperation({
    summary: 'Obtiene el valor actual, promedio del mes y el primer registro de la divisa.',
    description: `Devuelve el valor actual de la divisa solicitada, junto con el promedio mensual y otros detalles 
                  sobre el primer y último valor registrado del mes.`,
  })
  @ApiParam({
    name: 'currency',
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(CurrenciesEnum),
      example: 'DOLAR',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Divisa encontrada y procesada exitosamente',
    type: CurrencyResponseDto,
    content: {
      'application/json': {
        example: {
          currency: 'EURO',
          average: 1350.78,
          records: [
            {
              date: '2024-09-01',
              value: 1350.78,
              details: 'Mil trescientos cincuenta pesos con setenta y ocho centavos',
              _note: 'Valor actualizado al día de hoy.',
            },
            {
              date: '2024-09-15',
              value: 1358.42,
              details: 'Mil trescientos cincuenta y ocho pesos con cuarenta y dos centavos',
              _note: 'Valor del primer día del mes.',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Divisa no válida o no soportada por la API.',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          timestamp: '2024-09-22T02:26:46.808Z',
          path: '/v1/divisas/YEN',
          method: 'GET',
          message: 'YEN no es una divisa admitida o soportada por nuestra API.',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Datos no encontrados para la divisa solicitada.',
    content: {
      'application/json': {
        example: {
          statusCode: 404,
          timestamp: '2024-09-22T02:26:46.808Z',
          path: '/v1/divisas/dolar',
          method: 'GET',
          message: 'No se encontraron registros para la divisa DOLAR en el periodo solicitado.',
        },
      },
    },
  })
  async getCurrency(@Param('currency', CurrenciesParsePipe) currency: CurrenciesEnum) {
    return await this.service.retrieveDetailsCurrencyIndicator(currency);
  }
}

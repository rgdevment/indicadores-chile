import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ForeignExchangeService } from './foreign-exchange/foreign-exchange.service';
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
    summary: 'Obtiene un indicador específico.',
    description: 'Recopila y procesa información sobre el indicador solicitado.',
  })
  @ApiParam({
    name: 'indicator',
    description: 'Indicador económico a obtener (UF, IPC, DÓLAR, EURO, etc.)',
    enum: IndicatorsEnum,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta exitosa',
    content: {
      'application/json': {
        examples: {
          IPC: {
            summary: 'Respuesta para IPC',
            value: {
              indicator: 'IPC',
              accumulated: 12.34,
              accumulatedYearly: 123.45,
              data: [
                {
                  date: '2024-09-01',
                  value: 3.5,
                  details: 'Índice de Precios al Consumidor (IPC)',
                  _note: 'Valor actual del IPC',
                },
              ],
            },
          },
          UF: {
            summary: 'Respuesta para Económicos',
            value: {
              indicator: 'UF',
              average: 37849.91,
              data: [
                {
                  date: '2024-09-12',
                  value: 37842.34,
                  details: 'treinta y siete mil ochocientos cuarenta y dos pesos con treinta y cuatro céntimos',
                  _note: 'Valor actualizado al día de hoy, o del último registro disponible.',
                },
                {
                  date: '2024-09-01',
                  value: 37762.97,
                  details: 'treinta y siete mil setecientos sesenta y dos pesos con noventa y siete céntimos',
                  _note: 'Valor del primer día del mes.',
                },
                {
                  date: '2024-09-30',
                  value: 37910.42,
                  details: 'treinta y siete mil novecientos diez pesos con cuarenta y dos céntimos',
                  _note: 'Valor del último día del mes, o el último valor registrado en el mes.',
                },
              ],
            },
          },
          Divisas: {
            summary: 'Respuesta para Divisas',
            value: {
              indicator: 'DÓLAR',
              average: 780.5,
              data: [
                {
                  date: '2024-09-01',
                  value: 780.5,
                  details: 'Valor actual del dólar',
                  _note: 'Valor actual del dólar.',
                },
                {
                  date: '2024-09-01',
                  value: 775.1,
                  details: 'Primer valor del mes',
                  _note: 'Primer valor registrado del mes.',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Indicador no válido',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          timestamp: '2024-09-12T13:55:18.060Z',
          path: '/v1/utme',
          method: 'GET',
          message: 'null no es un valor de indicador admitido.',
        },
      },
    },
  })
  async indicators(@Param('indicator', IndicatorsParsePipe) indicator: IndicatorsEnum) {
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

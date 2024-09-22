import { Controller, Get, Param, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';
import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicsParsePipe } from '@modules/economics/validators/economics-parse.pipe';
import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';

@ApiTags('Económicos')
@UseFilters(GlobalExceptionFilter)
@Controller()
export class EconomicsController {
  constructor(private readonly service: EconomicsService) {}

  @Get(':indicator')
  @ApiOperation({
    summary: 'Obtiene el valor actual, promedio mensual, primer y último registro del indicador económico.',
    description: `Devuelve el valor actual del indicador económico solicitado, junto con el promedio mensual y otros 
                  detalles como el primer y último valor registrado del mes. Indicadores aceptados: UF, UTM, IPC.`,
  })
  @ApiParam({
    name: 'indicator',
    required: true,
    schema: {
      type: 'string',
      enum: Object.values(EconomicsEnum),
      example: 'UF',
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Indicador económico encontrado y procesado exitosamente',
    content: {
      'application/json': {
        examples: {
          IPC: {
            summary: 'Respuesta para IPC',
            value: {
              indicator: 'IPC',
              accumulated: 12.34,
              accumulatedYearly: 123.45,
              records: [
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
            summary: 'Respuesta para UF',
            value: {
              indicator: 'UF',
              average: 37849.91,
              records: [
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
          UTM: {
            summary: 'Respuesta para UTM',
            value: {
              indicator: 'UTM',
              records: [
                {
                  date: '2024-09-12',
                  value: 66362,
                  details: 'Sesenta y seis mil trescientos sesenta y dos pesos con cero céntimos',
                  _note: 'Valor actualizado al día de hoy, o del último registro disponible.',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiCommonErrors({
    resourceName: 'indicador económico',
    invalidExampleValue: 'CHL',
    notFoundExampleValue: 'uf',
    basePath: '/v1',
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

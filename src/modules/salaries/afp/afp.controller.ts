import { Controller, Get, Param } from '@nestjs/common';
import { AfpService } from '@modules/salaries/afp/afp.service';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';
import { AfpParsePipe } from '@modules/salaries/afp/validators/afp-parse.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AFPResponseDto } from '@modules/salaries/afp/dto/afp-response.dto';
import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';

@ApiTags('Salariales')
@Controller('afp')
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Get(':name')
  @ApiOperation({
    summary: 'Obtener datos actuales de una AFP específica',
    description:
      'Este endpoint permite recuperar los datos actuales de una AFP específica basada en el código proporcionado.',
  })
  @ApiParam({
    name: 'name',
    enum: AfpEnum,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Datos de la AFP recuperados exitosamente',
    type: AFPResponseDto,
  })
  @ApiCommonErrors({
    resourceName: 'Administradoras de Fondos de Pensiones',
    invalidExampleValue: 'estatal',
    notFoundExampleValue: 'estatal',
    basePath: '/v1/afp',
  })
  async getCurrency(@Param('name', AfpParsePipe) name: AfpEnum) {
    return await this.service.retrieveCurrentAFPData(name);
  }
}

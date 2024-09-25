import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WageService } from '@modules/salaries/wage/wage.service';
import { ApiCommonErrors } from '@common/decorators/swagger/api-common-errors.decorator';
import { WageResponseDto } from '@modules/salaries/wage/dto/wage-response.dto';

@ApiTags('Salariales')
@Controller('salary')
export class WageController {
  constructor(private readonly service: WageService) {}

  @Get('minimum')
  @ApiOperation({
    summary: 'Retrieve current and historic minimum wage data',
    description: 'Fetches the latest minimum wage data along with its historical records.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved wage data',
    type: WageResponseDto,
  })
  @ApiCommonErrors({
    resourceName: 'Minimum Wages',
    invalidExampleValue: 'invalid-date',
    notFoundExampleValue: 'No wage records found',
    basePath: '/v1/wage',
  })
  async getMinimumWage() {
    return await this.service.retrieveMinimumWage();
  }
}

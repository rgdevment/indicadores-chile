import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CommissionMandatoryDto } from './commission-mandatory.dto';
import { CommissionVoluntaryPensionDto } from './commission-voluntary-pension.dto';
import { CommissionVoluntarySavingDto } from './commission-voluntary-saving.dto';

export class AfpResponseDto {
  @ApiProperty({ example: 'HABITAT', description: 'Nombre de la AFP' })
  name!: string;

  @ApiPropertyOptional({ type: CommissionMandatoryDto, description: 'Cotización obligatoria' })
  quota?: CommissionMandatoryDto;

  @ApiPropertyOptional({ type: CommissionMandatoryDto, description: 'Comisión obligatoria' })
  mandatory?: CommissionMandatoryDto;

  @ApiPropertyOptional({ type: CommissionVoluntaryPensionDto, description: 'APV' })
  voluntaryPension?: CommissionVoluntaryPensionDto;

  @ApiPropertyOptional({ type: CommissionVoluntarySavingDto, description: 'Cuenta de ahorro voluntario' })
  voluntarySavings?: CommissionVoluntarySavingDto;
}

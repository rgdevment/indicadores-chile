import { ApiProperty } from '@nestjs/swagger';
import { CommissionMandatoryDto } from '@modules/salaries/afp/dto/commission-mandatory.dto';
import { CommissionVoluntaryPensionDto } from '@modules/salaries/afp/dto/commission-voluntary-pension.dto';
import { CommissionVoluntarySavingDto } from '@modules/salaries/afp/dto/commission-voluntary-saving.dto';

export class AFPResponseDto {
  @ApiProperty({ example: 'Capital', description: 'Nombre de la AFP' })
  name: string;

  @ApiProperty({ example: 1.44, description: 'Comisión de cotización obligatoria' })
  quota: number;

  @ApiProperty({ type: CommissionMandatoryDto, description: 'Comisiones de Cotizaciones Obligatorias' })
  mandatory: CommissionMandatoryDto;

  @ApiProperty({ type: CommissionVoluntaryPensionDto, description: 'Comisiones de Ahorro Previsional Voluntaria' })
  voluntaryPension: CommissionVoluntaryPensionDto;

  @ApiProperty({ type: CommissionVoluntarySavingDto, description: 'Comisiones de Cuentas de Ahorros voluntarios' })
  voluntarySavings: CommissionVoluntarySavingDto;
}

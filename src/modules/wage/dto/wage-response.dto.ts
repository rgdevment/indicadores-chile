import { ApiProperty } from '@nestjs/swagger';
import { WageEntryDto } from './wage-entry.dto';

export class WageResponseDto {
  @ApiProperty({ type: WageEntryDto, description: 'Salario mínimo vigente' })
  current!: WageEntryDto;

  @ApiProperty({ type: [WageEntryDto], description: 'Historial de salarios mínimos' })
  historic!: WageEntryDto[];
}

import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { WageEntryDto } from './wage-entry.dto';
import { ApiProperty } from '@nestjs/swagger';

export class WageResponseDto {
  @ApiProperty({
    description: 'Registro actual del salario mínimo',
    type: WageEntryDto,
  })
  @ValidateNested()
  @Type(() => WageEntryDto)
  current: WageEntryDto;

  @ApiProperty({
    description: 'Historial de registros de salarios mínimos',
    type: [WageEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WageEntryDto)
  historic: WageEntryDto[];
}

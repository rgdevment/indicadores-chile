import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionVoluntarySavingDto {
  @ApiPropertyOptional({ example: 0.6, description: 'Afiliados (%)' })
  affiliated?: number;
}

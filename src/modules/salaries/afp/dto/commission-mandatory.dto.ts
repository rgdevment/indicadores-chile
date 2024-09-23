import { ApiProperty } from '@nestjs/swagger';

export class CommissionMandatoryDto {
  @ApiProperty({ example: 1.44, description: 'Comisión de transacciones de deposito', required: false })
  deposit?: number;

  @ApiProperty({ example: 1.25, description: 'Comisión de transacciones de retiro', required: false })
  withdrawals?: number;

  @ApiProperty({ example: 1.101, description: 'Comisión de transacciones de transferencia', required: false })
  transfer?: number;
}

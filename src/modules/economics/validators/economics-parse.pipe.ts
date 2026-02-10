import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { EconomicsEnum } from '../enums/economics.enum';

@Injectable()
export class EconomicsParsePipe implements PipeTransform<string, EconomicsEnum> {
  transform(value: string, _metadata: ArgumentMetadata): EconomicsEnum {
    const upper = value.toUpperCase();
    if (!Object.values(EconomicsEnum).includes(upper as EconomicsEnum)) {
      throw new BadRequestException(
        `${value} no es un indicador económico admitido. Valores válidos: ${Object.values(EconomicsEnum).join(', ')}`,
      );
    }
    return upper as EconomicsEnum;
  }
}

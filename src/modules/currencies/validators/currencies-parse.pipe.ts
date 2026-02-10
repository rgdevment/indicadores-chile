import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { CurrenciesEnum } from '../enums/currencies.enum';

@Injectable()
export class CurrenciesParsePipe implements PipeTransform<string, CurrenciesEnum> {
  transform(value: string, _metadata: ArgumentMetadata): CurrenciesEnum {
    const upper = value.toUpperCase();
    if (!Object.values(CurrenciesEnum).includes(upper as CurrenciesEnum)) {
      throw new BadRequestException(
        `${value} no es una divisa admitida. Valores válidos: ${Object.values(CurrenciesEnum).join(', ')}`,
      );
    }
    return upper as CurrenciesEnum;
  }
}

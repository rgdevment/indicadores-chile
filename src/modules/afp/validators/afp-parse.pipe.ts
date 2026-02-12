import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { AfpEnum } from '../enums/afp.enum';

@Injectable()
export class AfpParsePipe implements PipeTransform<string, AfpEnum> {
  transform(value: string, _metadata: ArgumentMetadata): AfpEnum {
    const upper = value.toUpperCase();
    if (!Object.values(AfpEnum).includes(upper as AfpEnum)) {
      throw new BadRequestException(
        upper + ' no es una AFP admitida. Valores validos: ' + Object.values(AfpEnum).join(', '),
      );
    }
    return upper as AfpEnum;
  }
}

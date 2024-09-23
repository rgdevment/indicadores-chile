import { AfpDocument } from '@modules/salaries/afp/schemas/afp.document.interface';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';

export interface AfpRepository {
  findLatestAfp(afp: AfpEnum): Promise<AfpDocument[]>;
}

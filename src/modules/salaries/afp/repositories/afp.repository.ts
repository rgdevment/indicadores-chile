import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { AfpRepository } from '@modules/salaries/afp/repositories/afp.repository.interface';
import { AfpDocument } from '@modules/salaries/afp/schemas/afp.document.interface';
import { Afp } from '@modules/salaries/afp/schemas/afp';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';

@Injectable()
export class AfpRepositoryMongo implements AfpRepository {
  constructor(@InjectModel(Afp.name) private readonly model: Model<AfpDocument>) {}

  async findLatestAfp(afp: AfpEnum): Promise<AfpDocument[]> {
    const pipeline: PipelineStage[] = [
      {
        $match: {
          name: afp,
          commission: { $exists: true },
        },
      },
      {
        $sort: {
          category: 1,
          sub_category: 1,
          date: -1,
        },
      },
      {
        $group: {
          _id: {
            category: '$category',
            sub_category: '$sub_category',
          },
          doc: { $first: '$$ROOT' },
        },
      },
      {
        $replaceRoot: { newRoot: '$doc' },
      },
    ];

    return await this.model.aggregate(pipeline).exec();
  }
}

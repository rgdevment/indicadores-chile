import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WageRepository } from '@modules/salaries/wage/repositories/wage.repository.interface';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';
import { Wage } from '@modules/salaries/wage/schemas/wage';

@Injectable()
export class WageRepositoryMongo implements WageRepository {
  constructor(@InjectModel(Wage.name) private readonly model: Model<WageDocument>) {}

  async findAll(): Promise<WageDocument[]> {
    return await this.model.find().exec();
  }
}

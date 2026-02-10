import { WageEntity } from '@entities/wage.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WageRepository {
  constructor(
    @InjectRepository(WageEntity)
    private readonly repo: Repository<WageEntity>,
  ) {}

  async findAll(): Promise<WageEntity[]> {
    return this.repo.find({ order: { recorded_date: 'DESC' } });
  }
}

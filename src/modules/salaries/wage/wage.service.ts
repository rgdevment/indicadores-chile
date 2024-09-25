import { Inject, Injectable } from '@nestjs/common';
import { WageRepository } from '@modules/salaries/wage/repositories/wage.repository.interface';
import { WageEntryDto } from '@modules/salaries/wage/dto/wage-entry.dto';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class WageService {
  constructor(@Inject('WageRepository') private readonly repository: WageRepository) {}

  async retrieveMinimumWage() {
    const wageData: Partial<WageDocument>[] = await this.repository.findAll();

    if (!wageData || wageData.length === 0) {
      throw new Error('No wage records found');
    }

    wageData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentRecord = wageData[0];
    const historicRecords = wageData.slice(1);

    const currentDto = plainToInstance(WageEntryDto, {
      amount: currentRecord.salary,
      details: currentRecord.value_to_word,
      law: currentRecord.law,
      range: currentRecord.range,
      date: currentRecord.date,
    });

    const historicDto = historicRecords.map(record =>
      plainToInstance(WageEntryDto, {
        amount: record.salary,
        details: record.value_to_word,
        law: record.law,
        range: record.range,
        date: record.date,
      }),
    );

    return {
      current: currentDto,
      historic: historicDto,
    };
  }
}

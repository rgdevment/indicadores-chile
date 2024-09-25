import { Inject, Injectable } from '@nestjs/common';
import { WageRepository } from '@modules/salaries/wage/repositories/wage.repository.interface';
import { WageEntryDto } from '@modules/salaries/wage/dto/wage-entry.dto';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';

@Injectable()
export class WageService {
  constructor(@Inject('WageRepository') private readonly repository: WageRepository) {
  }

  async retrieveMinimumWage() {
    const wageData: Partial<WageDocument>[] = await this.repository.findAll();

    if (!wageData || wageData.length === 0) {
      throw new Error('No wage records found');
    }

    wageData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const currentRecord = wageData[0];
    const historicRecords = wageData.slice(1);

    const currentDto: WageEntryDto = new WageEntryDto(
      currentRecord.salary,
      currentRecord.value_to_word,
      currentRecord.law,
      currentRecord.range,
      currentRecord.date,
    );

    const historicDto: WageEntryDto[] = historicRecords.map(
      record => new WageEntryDto(record.salary, record.value_to_word, record.law, currentRecord.range, record.date),
    );

    return {
      current: currentDto,
      historic: historicDto,
    };
  }
}

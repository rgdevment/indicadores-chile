import { Inject, Injectable } from '@nestjs/common';
import { AfpRepository } from '@modules/salaries/afp/repositories/afp.repository.interface';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';
import { AFPResponseDto } from '@modules/salaries/afp/dto/afp-response.dto';
import { CommissionMandatoryDto } from '@modules/salaries/afp/dto/commission-mandatory.dto';
import { CommissionVoluntaryPensionDto } from '@modules/salaries/afp/dto/commission-voluntary-pension.dto';
import { CommissionVoluntarySavingDto } from '@modules/salaries/afp/dto/commission-voluntary-saving.dto';

@Injectable()
export class AfpService {
  constructor(@Inject('AfpRepository') private readonly repository: AfpRepository) {}

  async retrieveCurrentAFPData(afp: AfpEnum): Promise<AFPResponseDto> {
    const afpRecords = await this.repository.findLatestAfp(afp);

    let quota = 0;

    const mandatoryCommission: CommissionMandatoryDto = {};
    const voluntaryPensionCommission: CommissionVoluntaryPensionDto = {};
    const voluntarySavingsCommission: CommissionVoluntarySavingDto = {};

    const fieldMap = {
      APO_DEPOSIT: { dto: mandatoryCommission, field: 'deposit', isQuota: true },
      APO_WITHDRAWALS: { dto: mandatoryCommission, field: 'withdrawals' },
      APO_TRANSFER: { dto: mandatoryCommission, field: 'transfer' },
      APV_AFFILIATES: { dto: voluntaryPensionCommission, field: 'affiliated' },
      APV_NO_AFFILIATES: { dto: voluntaryPensionCommission, field: 'nonAffiliated' },
      APV_TRANSFER: { dto: voluntaryPensionCommission, field: 'transfer' },
      AV_AFFILIATES: { dto: voluntarySavingsCommission, field: 'affiliated' },
    };

    for (const record of afpRecords) {
      const commissionValue = this.parseCommissionValue(record.commission);
      const key = `${record.category}_${record.sub_category}`;
      const mapping = fieldMap[key];

      if (mapping) {
        mapping.dto[mapping.field] = commissionValue;
        if (mapping.isQuota) {
          quota = commissionValue;
        }
      }
    }

    const afpName = afpRecords.length > 0 ? afpRecords[0].name : '';

    return {
      name: afpName,
      quota,
      mandatory: mandatoryCommission,
      voluntaryPension: voluntaryPensionCommission,
      voluntarySavings: voluntarySavingsCommission,
    };
  }

  private parseCommissionValue(commission: string | number | null): number {
    if (commission !== undefined && commission !== null) {
      if (typeof commission === 'string') {
        return parseFloat(commission.replace(',', '.'));
      } else if (typeof commission === 'number') {
        return commission;
      }
    }
    return 0;
  }
}

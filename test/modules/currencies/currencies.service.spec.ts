import { CurrenciesService } from '@modules/currencies/currencies.service';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';
import { CurrencyRepository } from '@modules/currencies/repositories/currency.repository';
import { NotFoundException } from '@nestjs/common';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repo: jest.Mocked<CurrencyRepository>;

  beforeEach(() => {
    repo = {
      findLatestRecord: jest.fn(),
      findFirstOfMonth: jest.fn(),
      averageOfMonth: jest.fn(),
    } as any;
    service = new CurrenciesService(repo);
  });

  it('should return currency data', async () => {
    const entity = { recorded_date: '2026-02-10', value: 950, value_to_word: 'test' };
    repo.findLatestRecord.mockResolvedValue(entity as any);
    repo.findFirstOfMonth.mockResolvedValue(entity as any);
    repo.averageOfMonth.mockResolvedValue(948.5);

    const result = await service.getIndicator(CurrenciesEnum.DOLAR);
    expect(result.currency).toBe('DOLAR');
    expect(result.average).toBe(948.5);
    expect(result.records).toHaveLength(2);
  });

  it('should throw NotFoundException when no data found', async () => {
    repo.findLatestRecord.mockResolvedValue(null);
    repo.findFirstOfMonth.mockResolvedValue(null);
    repo.averageOfMonth.mockResolvedValue(null);

    await expect(service.getIndicator(CurrenciesEnum.EURO)).rejects.toThrow(NotFoundException);
  });
});

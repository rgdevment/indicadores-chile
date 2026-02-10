import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';
import { EconomicRepository } from '@modules/economics/repositories/economic.repository';
import { NotFoundException } from '@nestjs/common';

describe('EconomicsService', () => {
  let service: EconomicsService;
  let repo: jest.Mocked<EconomicRepository>;

  beforeEach(() => {
    repo = {
      findLatestRecord: jest.fn(),
      findFirstOfMonth: jest.fn(),
      findLastOfMonth: jest.fn(),
      averageOfMonth: jest.fn(),
      accumulatedLast12Months: jest.fn(),
      accumulatedCurrentYear: jest.fn(),
    } as any;
    service = new EconomicsService(repo);
  });

  describe('UF strategy', () => {
    it('should return UF with average and records', async () => {
      const entity = { recorded_date: '2026-02-10', value: 38200, value_to_word: 'test' };
      repo.findLatestRecord.mockResolvedValue(entity as any);
      repo.findFirstOfMonth.mockResolvedValue(entity as any);
      repo.findLastOfMonth.mockResolvedValue(entity as any);
      repo.averageOfMonth.mockResolvedValue(38150.33);

      const result = await service.getIndicator(EconomicsEnum.UF);
      expect(result.indicator).toBe('UF');
      expect(result.average).toBe(38150.33);
      expect(result.records.length).toBeGreaterThanOrEqual(1);
    });

    it('should throw NotFoundException when no data', async () => {
      repo.findLatestRecord.mockResolvedValue(null);
      repo.findFirstOfMonth.mockResolvedValue(null);
      repo.findLastOfMonth.mockResolvedValue(null);
      repo.averageOfMonth.mockResolvedValue(null);

      await expect(service.getIndicator(EconomicsEnum.UF)).rejects.toThrow(NotFoundException);
    });
  });

  describe('UTM strategy', () => {
    it('should return UTM with only current value', async () => {
      const entity = { recorded_date: '2026-02-01', value: 66000 };
      repo.findLatestRecord.mockResolvedValue(entity as any);

      const result = await service.getIndicator(EconomicsEnum.UTM);
      expect(result.indicator).toBe('UTM');
      expect(result.records).toHaveLength(1);
      expect(result.average).toBeUndefined();
    });
  });

  describe('IPC strategy', () => {
    it('should return IPC with accumulated values', async () => {
      const entity = { recorded_date: '2026-01-15', value: 0.3 };
      repo.findLatestRecord.mockResolvedValue(entity as any);
      repo.accumulatedLast12Months.mockResolvedValue(4.5);
      repo.accumulatedCurrentYear.mockResolvedValue(0.8);

      const result = await service.getIndicator(EconomicsEnum.IPC);
      expect(result.indicator).toBe('IPC');
      expect(result.accumulated).toBe(4.5);
      expect(result.accumulatedYearly).toBe(0.8);
    });
  });
});

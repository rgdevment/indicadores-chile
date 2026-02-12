import { WageRepository } from '@modules/wage/repositories/wage.repository';
import { WageService } from '@modules/wage/wage.service';
import { NotFoundException } from '@nestjs/common';

describe('WageService', () => {
  let service: WageService;
  let repo: jest.Mocked<WageRepository>;

  beforeEach(() => {
    repo = { findAll: jest.fn() } as any;
    service = new WageService(repo);
  });

  it('should throw NotFoundException when no data', async () => {
    repo.findAll.mockResolvedValue([]);
    await expect(service.getMinimumWage()).rejects.toThrow(NotFoundException);
  });

  it('should return current and historic wages', async () => {
    repo.findAll.mockResolvedValue([
      {
        salary: 500000,
        recorded_date: '2026-01-01',
        value_to_word: 'quinientos mil',
        law: 'Ley 21.578',
        range: '18-65',
      },
      {
        salary: 460000,
        recorded_date: '2025-01-01',
        value_to_word: 'cuatrocientos sesenta mil',
        law: 'Ley 21.456',
        range: '18-65',
      },
    ] as any);

    const result = await service.getMinimumWage();
    expect(result.current.amount).toBe(500000);
    expect(result.historic).toHaveLength(1);
    expect(result.historic[0].amount).toBe(460000);
  });

  it('should handle single record (no historic)', async () => {
    repo.findAll.mockResolvedValue([{ salary: 500000, recorded_date: '2026-01-01' }] as any);

    const result = await service.getMinimumWage();
    expect(result.current.amount).toBe(500000);
    expect(result.historic).toHaveLength(0);
  });
});

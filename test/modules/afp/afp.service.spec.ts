import { AfpService } from '@modules/afp/afp.service';
import { AfpEnum } from '@modules/afp/enums/afp.enum';
import { AfpRepository } from '@modules/afp/repositories/afp.repository';
import { NotFoundException } from '@nestjs/common';

describe('AfpService', () => {
  let service: AfpService;
  let repo: jest.Mocked<AfpRepository>;

  beforeEach(() => {
    repo = { findLatest: jest.fn() } as any;
    service = new AfpService(repo);
  });

  it('should throw NotFoundException when no records', async () => {
    repo.findLatest.mockResolvedValue([]);
    await expect(service.getCommissions(AfpEnum.HABITAT)).rejects.toThrow(NotFoundException);
  });

  it('should map commissions correctly', async () => {
    repo.findLatest.mockResolvedValue([
      {
        name: 'HABITAT',
        category: 'Cotización obligatoria',
        sub_category: 'Cotización (Depósitos)',
        commission: 11.44,
      },
      { name: 'HABITAT', category: 'Comisión obligatoria', sub_category: 'Cotización (Depósitos)', commission: 1.27 },
      { name: 'HABITAT', category: 'APV', sub_category: 'Afiliados', commission: '0.95' },
    ] as any);

    const result = await service.getCommissions(AfpEnum.HABITAT);
    expect(result.name).toBe('HABITAT');
    expect(result.quota?.deposit).toBe(11.44);
    expect(result.mandatory?.deposit).toBe(1.27);
    expect(result.voluntaryPension?.affiliated).toBe(0.95);
  });

  it('should handle null commission values', async () => {
    repo.findLatest.mockResolvedValue([
      { name: 'CAPITAL', category: 'Cotización obligatoria', sub_category: 'Cotización (Depósitos)', commission: null },
    ] as any);

    const result = await service.getCommissions(AfpEnum.CAPITAL);
    expect(result.quota?.deposit).toBeUndefined();
  });
});

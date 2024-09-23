import { Test, TestingModule } from '@nestjs/testing';
import { jest } from '@jest/globals';
import { AfpService } from '@modules/salaries/afp/afp.service';
import { AfpRepository } from '@modules/salaries/afp/repositories/afp.repository.interface';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';
import { AfpDocument } from '@modules/salaries/afp/schemas/afp.document.interface';

describe('AfpService', () => {
  let service: AfpService;
  let repository: jest.Mocked<AfpRepository>;

  const mockAfpRepository = {
    findLatestAfp: jest.fn(),
  } as jest.Mocked<AfpRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AfpService,
        {
          provide: 'AfpRepository',
          useValue: mockAfpRepository,
        },
      ],
    }).compile();

    service = module.get<AfpService>(AfpService);
    repository = module.get<AfpRepository>('AfpRepository') as jest.Mocked<AfpRepository>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve AFP data successfully', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        name: 'Capital',
        commission: '1,44',
        category: 'APO',
        sub_category: 'DEPOSIT',
      },
      {
        name: 'Capital',
        commission: 1.25,
        category: 'APO',
        sub_category: 'WITHDRAWALS',
      },
      {
        name: 'Capital',
        commission: 1.101,
        category: 'APO',
        sub_category: 'TRANSFER',
      },
      {
        name: 'Capital',
        commission: 0.51,
        category: 'APV',
        sub_category: 'AFFILIATES',
      },
      {
        name: 'Capital',
        commission: 0.51,
        category: 'APV',
        sub_category: 'NO_AFFILIATES',
      },
      {
        name: 'Capital',
        commission: 1.101,
        category: 'APV',
        sub_category: 'TRANSFER',
      },
      {
        name: 'Capital',
        commission: 0.89,
        category: 'AV',
        sub_category: 'AFFILIATES',
      },
    ];

    repository.findLatestAfp.mockResolvedValue(afpRecords as AfpDocument[]);

    const result = await service.retrieveCurrentAFPData(afp);

    expect(repository.findLatestAfp).toHaveBeenCalledWith(afp);
    expect(result).toEqual({
      name: 'Capital',
      quota: 1.44,
      mandatory: {
        deposit: 1.44,
        withdrawals: 1.25,
        transfer: 1.101,
      },
      voluntaryPension: {
        affiliated: 0.51,
        nonAffiliated: 0.51,
        transfer: 1.101,
      },
      voluntarySavings: {
        affiliated: 0.89,
      },
    });
  });

  it('should return default values when no AFP records are found', async () => {
    const afp = AfpEnum.CAPITAL;

    repository.findLatestAfp.mockResolvedValue([] as AfpDocument[]);

    const result = await service.retrieveCurrentAFPData(afp);

    expect(repository.findLatestAfp).toHaveBeenCalledWith(afp);
    expect(result).toEqual({
      name: '',
      quota: 0,
      mandatory: {},
      voluntaryPension: {},
      voluntarySavings: {},
    });
  });

  it('should handle non-numeric commission values gracefully', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        name: 'Capital',
        commission: null,
        category: 'APO',
        sub_category: 'DEPOSIT',
      },
    ];

    repository.findLatestAfp.mockResolvedValue(afpRecords as AfpDocument[]);

    const result = await service.retrieveCurrentAFPData(afp);

    expect(repository.findLatestAfp).toHaveBeenCalledWith(afp);
    expect(result.quota).toBe(0);
    expect(result.mandatory.deposit).toBe(0);
  });

  it('should correctly parse multiple records in the same category', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        name: 'Capital',
        commission: 1.44,
        category: 'APO',
        sub_category: 'DEPOSIT',
      },
      {
        name: 'Capital',
        commission: 1.5,
        category: 'APO',
        sub_category: 'DEPOSIT',
      },
    ];

    repository.findLatestAfp.mockResolvedValue(afpRecords as AfpDocument[]);

    const result = await service.retrieveCurrentAFPData(afp);

    expect(result.mandatory.deposit).toBe(1.5);
  });

  it('should parse commission values with commas as decimal separators', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        name: 'Capital',
        commission: 1.44,
        category: 'APO',
        sub_category: 'DEPOSIT',
      },
    ];

    repository.findLatestAfp.mockResolvedValue(afpRecords as AfpDocument[]);

    const result = await service.retrieveCurrentAFPData(afp);

    expect(repository.findLatestAfp).toHaveBeenCalledWith(afp);
    expect(result.quota).toBe(1.44);
    expect(result.mandatory.deposit).toBe(1.44);
  });

  it('should throw an error if the repository throws an error', async () => {
    const afp = AfpEnum.CAPITAL;

    repository.findLatestAfp.mockRejectedValue(new Error('Database error'));

    await expect(service.retrieveCurrentAFPData(afp)).rejects.toThrow('Database error');
    expect(repository.findLatestAfp).toHaveBeenCalledWith(afp);
  });
});

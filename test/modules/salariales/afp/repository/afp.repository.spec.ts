import { Test, TestingModule } from '@nestjs/testing';
import { Model, PipelineStage } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AfpRepositoryMongo } from '@modules/salaries/afp/repositories/afp.repository';
import { AfpDocument } from '@modules/salaries/afp/schemas/afp.document.interface';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';

describe('AfpRepositoryMongo', () => {
  let repository: AfpRepositoryMongo;
  let model: jest.Mocked<Model<AfpDocument>>;

  const mockAfpModel: Partial<jest.Mocked<Model<AfpDocument>>> = {
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AfpRepositoryMongo,
        {
          provide: getModelToken('Afp'),
          useValue: mockAfpModel,
        },
      ],
    }).compile();

    repository = module.get<AfpRepositoryMongo>(AfpRepositoryMongo);
    model = module.get<Model<AfpDocument>>(getModelToken('Afp')) as jest.Mocked<Model<AfpDocument>>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const setupAggregateMock = (records: Partial<AfpDocument>[]) => {
    model.aggregate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(records as AfpDocument[]),
    } as any);
  };

  const expectedPipeline: PipelineStage[] = [
    { $match: { name: AfpEnum.CAPITAL, commission: { $exists: true } } },
    { $sort: { category: 1, sub_category: 1, date: -1 } },
    {
      $group: {
        _id: { category: '$category', sub_category: '$sub_category' },
        doc: { $first: '$$ROOT' },
      },
    },
    { $replaceRoot: { newRoot: '$doc' } },
  ];

  it('should retrieve AFP data successfully with numeric commissions', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        _id: '1',
        name: 'Capital',
        commission: 1.44,
        category: 'APO',
        sub_category: 'DEPOSIT',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '2',
        name: 'Capital',
        commission: 1.25,
        category: 'APO',
        sub_category: 'WITHDRAWALS',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '3',
        name: 'Capital',
        commission: 1.101,
        category: 'APO',
        sub_category: 'TRANSFER',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '4',
        name: 'Capital',
        commission: 0.51,
        category: 'APV',
        sub_category: 'AFFILIATES',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '5',
        name: 'Capital',
        commission: 0.51,
        category: 'APV',
        sub_category: 'NO_AFFILIATES',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '6',
        name: 'Capital',
        commission: 1.101,
        category: 'APV',
        sub_category: 'TRANSFER',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '7',
        name: 'Capital',
        commission: 0.89,
        category: 'AV',
        sub_category: 'AFFILIATES',
        date: new Date(),
        update_at: new Date(),
      },
    ];

    setupAggregateMock(afpRecords);

    const result = await repository.findLatestAfp(afp);

    expect(model.aggregate).toHaveBeenCalledWith(expectedPipeline);
    expect(result).toEqual(afpRecords as AfpDocument[]);
  });

  it('should retrieve AFP data successfully with string commissions containing commas', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        _id: '1',
        name: 'Capital',
        commission: '1,44',
        category: 'APO',
        sub_category: 'DEPOSIT',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '2',
        name: 'Capital',
        commission: '1,25',
        category: 'APO',
        sub_category: 'WITHDRAWALS',
        date: new Date(),
        update_at: new Date(),
      },
    ];

    setupAggregateMock(afpRecords);

    const result = await repository.findLatestAfp(afp);

    expect(model.aggregate).toHaveBeenCalledWith(expectedPipeline);
    expect(result).toEqual(afpRecords as AfpDocument[]);
  });

  it('should retrieve AFP data successfully with string commissions without commas', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [
      {
        _id: '1',
        name: 'Capital',
        commission: '1.44',
        category: 'APO',
        sub_category: 'DEPOSIT',
        date: new Date(),
        update_at: new Date(),
      },
      {
        _id: '2',
        name: 'Capital',
        commission: '1.25',
        category: 'APO',
        sub_category: 'WITHDRAWALS',
        date: new Date(),
        update_at: new Date(),
      },
    ];

    setupAggregateMock(afpRecords);

    const result = await repository.findLatestAfp(afp);

    expect(model.aggregate).toHaveBeenCalledWith(expectedPipeline);
    expect(result).toEqual(afpRecords as AfpDocument[]);
  });

  it('should return empty array when no AFP records are found', async () => {
    const afp = AfpEnum.CAPITAL;

    const afpRecords: Partial<AfpDocument>[] = [];

    setupAggregateMock(afpRecords);

    const result = await repository.findLatestAfp(afp);

    expect(model.aggregate).toHaveBeenCalledWith(expectedPipeline);
    expect(result).toEqual([]);
  });

  it('should throw an error if the repository throws an error', async () => {
    const afp = AfpEnum.CAPITAL;

    const error = new Error('Database error');

    model.aggregate.mockReturnValue({
      exec: jest.fn().mockRejectedValue(error),
    } as any);

    await expect(repository.findLatestAfp(afp)).rejects.toThrow('Database error');

    expect(model.aggregate).toHaveBeenCalledWith(expectedPipeline);
  });
});

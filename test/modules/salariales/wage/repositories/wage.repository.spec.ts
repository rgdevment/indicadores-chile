import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wage } from '@modules/salaries/wage/schemas/wage';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';
import { WageRepositoryMongo } from '@modules/salaries/wage/repositories/wage.repository';

describe('WageRepositoryMongo', () => {
  let repository: WageRepositoryMongo;
  let model: jest.Mocked<Model<WageDocument>>;

  const mockWageModel = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WageRepositoryMongo,
        {
          provide: getModelToken(Wage.name),
          useValue: mockWageModel,
        },
      ],
    }).compile();

    repository = module.get<WageRepositoryMongo>(WageRepositoryMongo);
    model = module.get<Model<WageDocument>>(getModelToken(Wage.name)) as jest.Mocked<Model<WageDocument>>;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return an array of WageDocuments', async () => {
    const mockWageDocuments: Partial<WageDocument>[] = [
      {
        date: new Date('2024-07-01'),
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        salary: 500000,
        value_to_word: 'quinientos mil pesos',
      },
      {
        date: new Date('2023-09-01'),
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        salary: 460000,
        value_to_word: 'cuatrocientos sesenta mil pesos',
      },
    ];

    model.find.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockWageDocuments),
    } as any);

    const result = await repository.findAll();

    expect(model.find).toHaveBeenCalled();
    expect(result).toEqual(mockWageDocuments);
  });

  it('should throw an error when model.find().exec() fails', async () => {
    const error = new Error('Database error');

    model.find.mockReturnValue({
      lean: jest.fn().mockReturnThis(),
      exec: jest.fn().mockRejectedValue(error),
    } as any);

    await expect(repository.findAll()).rejects.toThrow('Database error');
    expect(model.find).toHaveBeenCalled();
  });
});

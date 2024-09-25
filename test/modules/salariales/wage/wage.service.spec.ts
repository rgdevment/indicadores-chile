import { Test, TestingModule } from '@nestjs/testing';
import { WageService } from '@modules/salaries/wage/wage.service';
import { WageRepository } from '@modules/salaries/wage/repositories/wage.repository.interface';
import { WageDocument } from '@modules/salaries/wage/schemas/wage.document.interface';
import { WageResponseDto } from '@modules/salaries/wage/dto/wage-response.dto';
import { WageEntryDto } from '@modules/salaries/wage/dto/wage-entry.dto';
import { plainToInstance } from 'class-transformer';

describe('WageService', () => {
  let service: WageService;
  let repository: WageRepository;

  const mockWageRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WageService,
        {
          provide: 'WageRepository',
          useValue: mockWageRepository,
        },
      ],
    }).compile();

    service = module.get<WageService>(WageService);
    repository = module.get<WageRepository>('WageRepository');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return wage data successfully', async () => {
    const mockWageData: Partial<WageDocument>[] = [
      {
        salary: 500000,
        value_to_word: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: new Date('2024-07-01T00:00:00.000Z'),
      },
      {
        salary: 460000,
        value_to_word: 'cuatrocientos sesenta mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: new Date('2023-09-01T00:00:00.000Z'),
      },
      {
        salary: 410000,
        value_to_word: 'cuatrocientos diez mil pesos',
        law: 'Ley 21.456 (26-05-2022)',
        range: '18<edad≤65',
        date: new Date('2023-01-01T00:00:00.000Z'),
      },
    ];

    const expectedDto = plainToInstance(WageResponseDto, {
      current: {
        amount: 500000,
        details: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: '2024-07-01',
      },
      historic: [
        {
          amount: 460000,
          details: 'cuatrocientos sesenta mil pesos',
          law: 'Ley 21.578 (30-05-2022)',
          range: '18<edad≤65',
          date: '2023-09-01',
        },
        {
          amount: 410000,
          details: 'cuatrocientos diez mil pesos',
          law: 'Ley 21.456 (26-05-2022)',
          range: '18<edad≤65',
          date: '2023-01-01',
        },
      ],
    });

    mockWageRepository.findAll.mockResolvedValue(mockWageData);

    const result = await service.retrieveMinimumWage();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedDto);

    expect(result.current).toBeInstanceOf(WageEntryDto);
    result.historic.forEach(entry => {
      expect(entry).toBeInstanceOf(WageEntryDto);
    });
  });

  it('should throw an error when no wage records are found', async () => {
    mockWageRepository.findAll.mockResolvedValue([]);

    await expect(service.retrieveMinimumWage()).rejects.toThrow('No wage records found');
    expect(repository.findAll).toHaveBeenCalled();
  });

  it('should handle single record correctly', async () => {
    const mockWageData: Partial<WageDocument>[] = [
      {
        salary: 500000,
        value_to_word: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: new Date('2024-07-01T00:00:00.000Z'),
      },
    ];

    const expectedDto = plainToInstance(WageResponseDto, {
      current: {
        amount: 500000,
        details: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: '2024-07-01',
      },
      historic: [],
    });

    mockWageRepository.findAll.mockResolvedValue(mockWageData);

    const result = await service.retrieveMinimumWage();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedDto);

    expect(result.current).toBeInstanceOf(WageEntryDto);
    expect(result.historic).toHaveLength(0);
  });

  it('should correctly sort records by date descending', async () => {
    const mockWageData: Partial<WageDocument>[] = [
      {
        salary: 410000,
        value_to_word: 'cuatrocientos diez mil pesos',
        law: 'Ley 21.456 (26-05-2022)',
        range: '18<edad≤65',
        date: new Date('2023-01-01T00:00:00.000Z'),
      },
      {
        salary: 500000,
        value_to_word: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: new Date('2024-07-01T00:00:00.000Z'),
      },
      {
        salary: 460000,
        value_to_word: 'cuatrocientos sesenta mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: new Date('2023-09-01T00:00:00.000Z'),
      },
    ];

    const expectedDto = plainToInstance(WageResponseDto, {
      current: {
        amount: 500000,
        details: 'quinientos mil pesos',
        law: 'Ley 21.578 (30-05-2022)',
        range: '18<edad≤65',
        date: '2024-07-01',
      },
      historic: [
        {
          amount: 460000,
          details: 'cuatrocientos sesenta mil pesos',
          law: 'Ley 21.578 (30-05-2022)',
          range: '18<edad≤65',
          date: '2023-09-01',
        },
        {
          amount: 410000,
          details: 'cuatrocientos diez mil pesos',
          law: 'Ley 21.456 (26-05-2022)',
          range: '18<edad≤65',
          date: '2023-01-01',
        },
      ],
    });

    mockWageRepository.findAll.mockResolvedValue(mockWageData);

    const result = await service.retrieveMinimumWage();

    expect(repository.findAll).toHaveBeenCalled();
    expect(result).toEqual(expectedDto);

    expect(result.current).toBeInstanceOf(WageEntryDto);
    result.historic.forEach(entry => {
      expect(entry).toBeInstanceOf(WageEntryDto);
    });
  });
});

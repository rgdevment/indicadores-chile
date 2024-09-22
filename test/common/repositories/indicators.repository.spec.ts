import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { EconomicRepository } from '@modules/economics/repositories/economic.repository.interface';
import { CurrencyRepository } from '@modules/currencies/repositories/currency.repository.interface';
import { EconomicRepositoryMongo } from '@modules/economics/repositories/economic.repository';
import { CurrencyRepositoryMongo } from '@modules/currencies/repositories/currency.repository';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';

class MockModel {
  static findOne = jest.fn();
  static aggregate = jest.fn();
  static exec = jest.fn();
}

describe('EconomicRepository', () => {
  let economicRepository: EconomicRepository;
  let currencyRepository: CurrencyRepository;
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomicRepositoryMongo,
        {
          provide: getModelToken('Economic'),
          useValue: MockModel,
        },
        CurrencyRepositoryMongo,
        {
          provide: getModelToken('Currency'),
          useValue: MockModel,
        },
      ],
    }).compile();

    economicRepository = module.get<EconomicRepository>(EconomicRepositoryMongo);
    currencyRepository = module.get<CurrencyRepository>(CurrencyRepositoryMongo);
  });

  it('should find the current or last day record on day', async () => {
    const mockRecord = { indicator: EconomicsEnum.UF, date: '2023-09-01' };
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await economicRepository.findCurrentOrLastDayRecord(EconomicsEnum.UF);
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalledWith({
      indicator: EconomicsEnum.UF,
      date: { $lte: expect.any(String) },
    });
  });

  it('should find the current or last day record', async () => {
    const mockRecord = { indicator: EconomicsEnum.UF };
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await economicRepository.findCurrentOrLastDayRecord(EconomicsEnum.UF);
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalledWith({
      indicator: EconomicsEnum.UF,
      date: { $lte: expect.any(String) },
    });
  });

  it('should return null if no record is found', async () => {
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await economicRepository.findCurrentOrLastDayRecord(EconomicsEnum.UF);
    expect(result).toBeNull();
  });

  it('should calculate the average value of the month', async () => {
    const mockResults = [{ _id: null, average: 100 }];
    MockModel.aggregate.mockResolvedValue(mockResults);

    const result = await economicRepository.calculateAverageValueOfMonth(EconomicsEnum.UF);
    expect(result).toBe(100);
    expect(MockModel.aggregate).toHaveBeenCalledWith([
      {
        $match: {
          indicator: EconomicsEnum.UF,
          date: { $gte: expect.any(Date), $lte: expect.any(Date) },
        },
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$value' },
        },
      },
    ]);
  });

  it('should return null if no aggregation result is found', async () => {
    MockModel.aggregate.mockResolvedValue([]);

    const result = await economicRepository.calculateAverageValueOfMonth(EconomicsEnum.UF);
    expect(result).toBeNull();
  });

  it('should find the first record of the month on day', async () => {
    const mockRecord = { indicator: EconomicsEnum.UF, date: '2023-09-01' };
    MockModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await economicRepository.findFirstRecordOfMonth(EconomicsEnum.UF, new Date('2023-09-01'));
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalled();
  });

  it('should find the first record of the month', async () => {
    const mockRecord = { indicator: EconomicsEnum.UF };
    MockModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await economicRepository.findFirstRecordOfMonth(EconomicsEnum.UF);
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalled();
  });

  it('should return null if no record is found in the month', async () => {
    MockModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await economicRepository.findFirstRecordOfMonth(EconomicsEnum.UF, new Date('2023-09-01'));
    expect(result).toBeNull();
    expect(MockModel.findOne).toHaveBeenCalledTimes(31);
  });

  it('should find the last record of the month on day', async () => {
    const mockRecord = { indicator: CurrenciesEnum.DOLAR, date: '2023-09-30' };
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await currencyRepository.findLastRecordOfMonth(CurrenciesEnum.DOLAR, new Date('2023-09-30'));
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalledWith({
      indicator: CurrenciesEnum.DOLAR,
      date: { $lte: '2023-09-30' },
    });
  });

  it('should find the last record of the month', async () => {
    const mockRecord = { indicator: CurrenciesEnum.DOLAR };
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    const result = await currencyRepository.findLastRecordOfMonth(CurrenciesEnum.DOLAR);
    expect(result).toEqual(mockRecord);
    expect(MockModel.findOne).toHaveBeenCalledWith({
      indicator: CurrenciesEnum.DOLAR,
      date: { $lte: expect.any(String) },
    });
  });

  it('should return null if no last record is found', async () => {
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await currencyRepository.findLastRecordOfMonth(CurrenciesEnum.DOLAR, new Date('2023-09-30'));
    expect(result).toBeNull();
  });

  it('should calculate the accumulated value for the last 12 months', async () => {
    const mockResults = [{ _id: null, sum: 1200 }];
    const mockRecord = { indicator: CurrenciesEnum.DOLAR, date: '2023-09-01' };

    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(mockRecord),
    });

    MockModel.aggregate.mockResolvedValue(mockResults);

    const result = await currencyRepository.calculateAccumulatedValueLast12Months(CurrenciesEnum.DOLAR);
    expect(result).toBe(1200);
    expect(MockModel.findOne).toHaveBeenCalled();
    expect(MockModel.aggregate).toHaveBeenCalled();
  });

  it('should return null if no results for the last 12 months', async () => {
    MockModel.aggregate.mockResolvedValue([]);

    const result = await currencyRepository.calculateAccumulatedValueLast12Months(CurrenciesEnum.DOLAR);
    expect(result).toBeNull();
  });

  it('should return null if no last record is found for the last 12 months', async () => {
    MockModel.findOne.mockReturnValue({
      sort: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue(null),
    });

    const result = await currencyRepository.calculateAccumulatedValueLast12Months(CurrenciesEnum.DOLAR);
    expect(result).toBeNull();
    expect(MockModel.findOne).toHaveBeenCalledWith({ indicator: CurrenciesEnum.DOLAR });
    expect(MockModel.aggregate).not.toHaveBeenCalled();
  });

  it('should calculate the accumulated value for the year', async () => {
    const mockResults = [{ _id: null, sum: 3000 }];
    MockModel.aggregate.mockResolvedValue(mockResults);

    const result = await currencyRepository.calculateYearlyAccumulatedValue(CurrenciesEnum.DOLAR);
    expect(result).toBe(3000);
    expect(MockModel.aggregate).toHaveBeenCalled();
  });

  it('should return null if no results for the year', async () => {
    MockModel.aggregate.mockResolvedValue([]);

    const result = await currencyRepository.calculateYearlyAccumulatedValue(CurrenciesEnum.DOLAR);
    expect(result).toBeNull();
  });
});

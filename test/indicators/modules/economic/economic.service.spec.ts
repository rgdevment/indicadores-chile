import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { EconomicService } from '@modules/economic/economic.service';
import { EconomicRepository } from '@modules/economic/economic.repository';
import { IndicatorsEnum } from '@modules/indicators.enum';
import { IndicatorsValueDto } from '../../../../src/indicators/dto/indicators-value.dto';

describe('EconomicService', () => {
  let service: EconomicService;

  const mockRepository = {
    findCurrentOrLastDayRecord: jest.fn(),
    calculateAccumulatedValueLast12Months: jest.fn(),
    calculateYearlyAccumulatedValue: jest.fn(),
    findFirstRecordOfMonth: jest.fn(),
    calculateAverageValueOfMonth: jest.fn(),
    findLastRecordOfMonth: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn().mockReturnValue('mocked translation'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomicService,
        { provide: EconomicRepository, useValue: mockRepository },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<EconomicService>(EconomicService);
  });

  it('should retrieve UF indicator details', async () => {
    const mockIndicatorRecord = { value: 123, date: '2023-09-01', value_to_word: 'one two three' };
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(mockIndicatorRecord);
    mockRepository.findFirstRecordOfMonth.mockResolvedValue(mockIndicatorRecord);
    mockRepository.calculateAverageValueOfMonth.mockResolvedValue(120);
    mockRepository.findLastRecordOfMonth.mockResolvedValue(mockIndicatorRecord);

    const result = await service.retrieveDetailsUFIndicator(IndicatorsEnum.UF);

    expect(result).toEqual({
      indicator: IndicatorsEnum.UF,
      data: [
        new IndicatorsValueDto(123, new Date('2023-09-01'), 'one two three', 'mocked translation'),
        new IndicatorsValueDto(123, new Date('2023-09-01'), 'one two three', 'mocked translation'),
        new IndicatorsValueDto(123, new Date('2023-09-01'), 'one two three', 'mocked translation'),
      ],
      average: 120,
    });
  });

  it('should throw NotFoundException if UF indicator record is not found', async () => {
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(null);

    await expect(service.retrieveDetailsUFIndicator(IndicatorsEnum.UF)).rejects.toThrow(NotFoundException);
  });

  it('should retrieve IPC indicator details', async () => {
    const mockIndicatorRecord = { value: 456, date: '2023-09-01', value_to_word: 'four five six' };
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(mockIndicatorRecord);
    mockRepository.calculateAccumulatedValueLast12Months.mockResolvedValue(5);
    mockRepository.calculateYearlyAccumulatedValue.mockResolvedValue(10);

    const result = await service.retrieveDetailsIPCIndicator(IndicatorsEnum.IPC);

    expect(result).toEqual({
      indicator: IndicatorsEnum.IPC,
      data: [new IndicatorsValueDto(456, new Date('2023-09-01'), 'four five six', 'mocked translation')],
      accumulated: 10,
      accumulatedYearly: 5,
    });
  });

  it('should retrieve the current indicator', async () => {
    const mockIndicatorRecord = { value: 789, date: '2023-09-01', value_to_word: 'seven eight nine' };
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(mockIndicatorRecord);

    const result = await service.findCurrentIndicator(IndicatorsEnum.DOLAR);

    expect(result).toEqual({
      indicator: IndicatorsEnum.DOLAR,
      data: [new IndicatorsValueDto(789, new Date('2023-09-01'), 'seven eight nine', 'mocked translation')],
    });
  });
});

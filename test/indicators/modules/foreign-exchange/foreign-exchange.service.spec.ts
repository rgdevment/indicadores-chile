import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { ForeignExchangeService } from '@modules/foreign-exchange/foreign-exchange.service';
import { ForeignExchangeRepository } from '@modules/foreign-exchange/foreign-exchange.repository';
import { IndicatorsEnum } from '@modules/indicators.enum';
import { IndicatorsValueDto } from '../../../../src/indicators/dto/indicators-value.dto';

describe('ForeignExchangeService', () => {
  let service: ForeignExchangeService;

  const mockRepository = {
    findCurrentOrLastDayRecord: jest.fn(),
    findFirstRecordOfMonth: jest.fn(),
    calculateAverageValueOfMonth: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn().mockReturnValue('mocked translation'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ForeignExchangeService,
        { provide: ForeignExchangeRepository, useValue: mockRepository },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    service = module.get<ForeignExchangeService>(ForeignExchangeService);
  });

  it('should retrieve foreign exchange indicator details', async () => {
    const mockIndicatorRecord = { value: 123, date: '2023-09-01', value_to_word: 'one two three' };
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(mockIndicatorRecord);
    mockRepository.findFirstRecordOfMonth.mockResolvedValue(mockIndicatorRecord);
    mockRepository.calculateAverageValueOfMonth.mockResolvedValue(120);

    const result = await service.retrieveDetailsFxIndicator(IndicatorsEnum.DOLAR);

    expect(result).toEqual({
      indicator: IndicatorsEnum.DOLAR,
      data: [
        new IndicatorsValueDto(123, new Date('2023-09-01'), 'one two three', 'mocked translation'),
        new IndicatorsValueDto(123, new Date('2023-09-01'), 'one two three', 'mocked translation'),
      ],
      average: 120,
    });
  });

  it('should throw NotFoundException if current indicator record is not found', async () => {
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(null);

    await expect(service.retrieveDetailsFxIndicator(IndicatorsEnum.DOLAR)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if first indicator record is not found', async () => {
    const mockIndicatorRecord = { value: 123, date: '2023-09-01', value_to_word: 'one two three' };
    mockRepository.findCurrentOrLastDayRecord.mockResolvedValue(mockIndicatorRecord);
    mockRepository.findFirstRecordOfMonth.mockResolvedValue(null);

    await expect(service.retrieveDetailsFxIndicator(IndicatorsEnum.DOLAR)).rejects.toThrow(NotFoundException);
  });
});

import { IndicatorsController } from '@modules/indicators.controller';
import { EconomicService } from '@modules/economic/economic.service';
import { ForeignExchangeService } from '@modules/foreign-exchange/foreign-exchange.service';
import { Test, TestingModule } from '@nestjs/testing';
import { IndicatorsEnum } from '@modules/indicators.enum';
import { IndicatorsValueDto } from '../../../src/indicators/dto/indicators-value.dto';
import { IndicatorsResponseDto } from '../../../src/indicators/dto/indicators-response.dto';
import { EconomicRepository } from '@modules/economic/economic.repository';
import { I18nService } from 'nestjs-i18n';
import { ForeignExchangeRepository } from '@modules/foreign-exchange/foreign-exchange.repository';

describe('IndicatorsController', () => {
  let controller: IndicatorsController;
  let economicService: EconomicService;
  let fxService: ForeignExchangeService;

  const mockEconomicRepository = {
    findCurrentOrLastDayRecord: jest.fn(),
    calculateAccumulatedValueLast12Months: jest.fn(),
    calculateYearlyAccumulatedValue: jest.fn(),
    findFirstRecordOfMonth: jest.fn(),
    calculateAverageValueOfMonth: jest.fn(),
    findLastRecordOfMonth: jest.fn(),
  };

  const mockForeignExchangeRepository = {
    findCurrentOrLastDayRecord: jest.fn(),
    calculateAccumulatedValueLast12Months: jest.fn(),
    calculateYearlyAccumulatedValue: jest.fn(),
  };

  const mockI18nService = {
    t: jest.fn().mockReturnValue('mocked translation'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IndicatorsController],
      providers: [
        EconomicService,
        ForeignExchangeService,
        {
          provide: EconomicRepository,
          useValue: mockEconomicRepository,
        },
        {
          provide: ForeignExchangeRepository,
          useValue: mockForeignExchangeRepository,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
      ],
    }).compile();

    controller = module.get<IndicatorsController>(IndicatorsController);
    economicService = module.get<EconomicService>(EconomicService);
    fxService = module.get<ForeignExchangeService>(ForeignExchangeService);
  });

  it('should return an UF data', async () => {
    const result = {
      data: [new IndicatorsValueDto(123, new Date(), 'uno dos tres', 'Not Key')],
      indicator: 'UF',
    } as IndicatorsResponseDto;

    jest.spyOn(economicService, 'retrieveDetailsUFIndicator').mockResolvedValue(result);
    jest.spyOn(fxService, 'retrieveDetailsFxIndicator').mockResolvedValue(result);

    expect(await controller.indicators(IndicatorsEnum.UF)).toBe(result);
  });

  it('should return an Dolar data', async () => {
    const result = {
      data: [new IndicatorsValueDto(123, new Date(), 'uno dos tres', 'Not Key')],
      indicator: 'DOLAR',
    } as IndicatorsResponseDto;

    jest.spyOn(fxService, 'retrieveDetailsFxIndicator').mockResolvedValue(result);

    expect(await controller.indicators(IndicatorsEnum.DOLAR)).toBe(result);
  });

  it('should return an Euro data', async () => {
    const result = {
      data: [new IndicatorsValueDto(123, new Date(), 'uno dos tres', 'Not Key')],
      indicator: 'EURO',
    } as IndicatorsResponseDto;

    jest.spyOn(fxService, 'retrieveDetailsFxIndicator').mockResolvedValue(result);

    expect(await controller.indicators(IndicatorsEnum.EURO)).toBe(result);
  });

  it('should return an IPC data', async () => {
    const result = {
      data: [new IndicatorsValueDto(123, new Date(), 'uno dos tres', 'Not Key')],
      indicator: 'IPC',
    } as IndicatorsResponseDto;

    jest.spyOn(economicService, 'retrieveDetailsIPCIndicator').mockResolvedValue(result);

    expect(await controller.indicators(IndicatorsEnum.IPC)).toBe(result);
  });

  it('should return an UTM data', async () => {
    const result = {
      data: [new IndicatorsValueDto(123, new Date(), 'uno dos tres', 'Not Key')],
      indicator: 'UTM',
    } as IndicatorsResponseDto;

    jest.spyOn(economicService, 'findCurrentIndicator').mockResolvedValue(result);

    expect(await controller.indicators(IndicatorsEnum.UTM)).toBe(result);
  });

  it('should return null for an invalid indicator', async () => {
    jest.spyOn(economicService, 'findCurrentIndicator').mockResolvedValue(null);
    const result = await controller.indicators('ANY' as unknown as IndicatorsEnum);
    expect(result).toBeNull();
  });
});

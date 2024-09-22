import { Test, TestingModule } from '@nestjs/testing';
import { EconomicRepository } from '@modules/economics/repositories/economic.repository.interface';
import { I18nService } from 'nestjs-i18n';
import { NotFoundException } from '@nestjs/common';
import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { EconomicDocument } from '@modules/economics/schemas/economic.document.interface';
import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';
import { EconomicResponseDto } from '@modules/economics/dto/economic-response.dto';

describe('EconomicsService', () => {
  let service: EconomicsService;
  let repository: jest.Mocked<EconomicRepository>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EconomicsService,
        {
          provide: 'EconomicRepository',
          useValue: {
            findCurrentOrLastDayRecord: jest.fn(),
            findFirstRecordOfMonth: jest.fn(),
            calculateAverageValueOfMonth: jest.fn(),
            findLastRecordOfMonth: jest.fn(),
            calculateAccumulatedValueLast12Months: jest.fn(),
            calculateYearlyAccumulatedValue: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EconomicsService>(EconomicsService);
    repository = module.get('EconomicRepository') as jest.Mocked<EconomicRepository>;
    i18n = module.get<I18nService>(I18nService) as jest.Mocked<I18nService>;
  });

  describe('retrieveDetailsIPCIndicator', () => {
    it('should return EconomicResponseDto with valid data', async () => {
      const indicator = EconomicsEnum.IPC;
      const mockCurrentRecord: EconomicDocument = {
        indicator,
        date: new Date('2024-09-17'),
        value: 3.5,
        value_to_word: 'tres coma cinco por ciento',
        update_at: new Date(),
      } as EconomicDocument;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(mockCurrentRecord);
      repository.calculateAccumulatedValueLast12Months.mockResolvedValue(1.2);
      repository.calculateYearlyAccumulatedValue.mockResolvedValue(0.8);

      i18n.t.mockImplementation((key: string) => {
        if (key === 'indicators.CURRENT_VALUE_NOTE') return 'Valor actual del indicador.';
        if (key === 'indicators.INDICATOR_NOT_FOUND') return 'Indicador no encontrado.';
        return '';
      });

      const result = await service.retrieveDetailsIPCIndicator(indicator);

      expect(result).toBeInstanceOf(EconomicResponseDto);
      expect(result.indicator).toBe(indicator);
      expect(result.accumulated).toBe(0.8);
      expect(result.accumulatedYearly).toBe(1.2);
      expect(result.records).toHaveLength(1);

      const [current] = result.records;
      expect(current).toBeInstanceOf(IndicatorValueDto);
      expect(current.date).toBe('2024-09-17');
      expect(current.value).toBe(3.5);
      expect(current.details).toBe('tres coma cinco por ciento');
      expect(current._note).toBe('Valor actual del indicador.');
    });

    it('should throw NotFoundException when current indicator is not found', async () => {
      const indicator = EconomicsEnum.IPC;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(null);

      i18n.t.mockImplementation((key: string, options?: any) => {
        if (key === 'indicators.INDICATOR_NOT_FOUND') {
          return `No se encontró el indicador para ${options.args.indicator}`;
        }
        return '';
      });

      await expect(service.retrieveDetailsIPCIndicator(indicator)).rejects.toThrow(NotFoundException);

      expect(i18n.t).toHaveBeenCalledWith('indicators.INDICATOR_NOT_FOUND', {
        args: { indicator },
      });
    });
  });

  describe('retrieveDetailsUFIndicator', () => {
    it('should return EconomicResponseDto with valid data', async () => {
      const indicator = EconomicsEnum.UF;
      const mockCurrentRecord: EconomicDocument = {
        indicator,
        date: new Date('2024-09-17'),
        value: 29350.78,
        value_to_word: 'veintinueve mil trescientos cincuenta pesos con setenta y ocho centavos',
        update_at: new Date(),
      } as EconomicDocument;

      const mockFirstRecord: EconomicDocument = {
        indicator,
        date: new Date('2024-09-01'),
        value: 29300.0,
        value_to_word: 'veintinueve mil trescientos pesos',
        update_at: new Date(),
      } as EconomicDocument;

      const mockLastRecord: EconomicDocument = {
        indicator,
        date: new Date('2024-09-30'),
        value: 29400.0,
        value_to_word: 'veintinueve mil cuatrocientos pesos',
        update_at: new Date(),
      } as EconomicDocument;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(mockCurrentRecord);
      repository.findFirstRecordOfMonth.mockResolvedValue(mockFirstRecord);
      repository.calculateAverageValueOfMonth.mockResolvedValue(29350.0);
      repository.findLastRecordOfMonth.mockResolvedValue(mockLastRecord);

      i18n.t.mockImplementation((key: string) => {
        if (key === 'indicators.CURRENT_VALUE_NOTE') return 'Valor actual del indicador.';
        if (key === 'indicators.FIRST_DAY_MONTH_NOTE') return 'Valor del primer día del mes.';
        if (key === 'indicators.LAST_RECORD_VALUE_NOTE') return 'Último valor registrado del mes.';
        if (key === 'indicators.INDICATOR_NOT_FOUND') return 'Indicador no encontrado.';
        return '';
      });

      const result = await service.retrieveDetailsUFIndicator(indicator);

      expect(result).toBeInstanceOf(EconomicResponseDto);
      expect(result.indicator).toBe(indicator);
      expect(result.average).toBe(29350.0);
      expect(result.records).toHaveLength(3);

      const [current, first, last] = result.records;

      expect(current.date).toBe('2024-09-17');
      expect(current.value).toBe(29350.78);
      expect(current.details).toBe('veintinueve mil trescientos cincuenta pesos con setenta y ocho centavos');
      expect(current._note).toBe('Valor actual del indicador.');

      expect(first.date).toBe('2024-09-01');
      expect(first.value).toBe(29300.0);
      expect(first.details).toBe('veintinueve mil trescientos pesos');
      expect(first._note).toBe('Valor del primer día del mes.');

      expect(last.date).toBe('2024-09-30');
      expect(last.value).toBe(29400.0);
      expect(last.details).toBe('veintinueve mil cuatrocientos pesos');
      expect(last._note).toBe('Último valor registrado del mes.');
    });

    it('should throw NotFoundException when current indicator is not found', async () => {
      const indicator = EconomicsEnum.UF;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(null);

      i18n.t.mockImplementation((key: string, options?: any) => {
        if (key === 'indicators.INDICATOR_NOT_FOUND') {
          return `No se encontró el indicador para ${options.args.indicator}`;
        }
        return '';
      });

      await expect(service.retrieveDetailsUFIndicator(indicator)).rejects.toThrow(NotFoundException);

      expect(i18n.t).toHaveBeenCalledWith('indicators.INDICATOR_NOT_FOUND', {
        args: { indicator },
      });
    });
  });

  describe('retrieveDetailsUTMIndicator', () => {
    it('should return EconomicResponseDto with valid data', async () => {
      const indicator = EconomicsEnum.UTM;
      const mockCurrentRecord: EconomicDocument = {
        indicator,
        date: new Date('2024-09-17'),
        value: 55000.0,
        value_to_word: 'cincuenta y cinco mil pesos',
        update_at: new Date(),
      } as EconomicDocument;

      // Mock repository methods
      repository.findCurrentOrLastDayRecord.mockResolvedValue(mockCurrentRecord);

      // Mock I18nService
      i18n.t.mockImplementation((key: string) => {
        if (key === 'indicators.CURRENT_VALUE_NOTE') return 'Valor actual del indicador.';
        if (key === 'indicators.INDICATOR_NOT_FOUND') return 'Indicador no encontrado.';
        return '';
      });

      const result = await service.retrieveDetailsUTMIndicator(indicator);

      expect(result).toBeInstanceOf(EconomicResponseDto);
      expect(result.indicator).toBe(indicator);
      expect(result.records).toHaveLength(1);

      const [current] = result.records;

      expect(current.date).toBe('2024-09-17');
      expect(current.value).toBe(55000.0);
      expect(current.details).toBe('cincuenta y cinco mil pesos');
      expect(current._note).toBe('Valor actual del indicador.');
    });

    it('should throw NotFoundException when current indicator is not found', async () => {
      const indicator = EconomicsEnum.UTM;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(null);

      i18n.t.mockImplementation((key: string, options?: any) => {
        if (key === 'indicators.INDICATOR_NOT_FOUND') {
          return `No se encontró el indicador para ${options.args.indicator}`;
        }
        return '';
      });

      await expect(service.retrieveDetailsUTMIndicator(indicator)).rejects.toThrow(NotFoundException);

      expect(i18n.t).toHaveBeenCalledWith('indicators.INDICATOR_NOT_FOUND', {
        args: { indicator },
      });
    });
  });
});

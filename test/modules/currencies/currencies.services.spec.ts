import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRepository } from '@modules/currencies/repositories/currency.repository.interface';
import { I18nService } from 'nestjs-i18n';
import { CurrencyResponseDto } from '@modules/currencies/dto/currency-response.dto';
import { IndicatorValueDto } from '@common/dto/indicator-value.dto';
import { NotFoundException } from '@nestjs/common';
import { CurrencyDocument } from '@modules/currencies/schemas/currency.document.interface';
import { CurrenciesService } from '@modules/currencies/currencies.service';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';

describe('CurrenciesService', () => {
  let service: CurrenciesService;
  let repository: jest.Mocked<CurrencyRepository>;
  let i18n: jest.Mocked<I18nService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CurrenciesService,
        {
          provide: 'CurrencyRepository',
          useValue: {
            findCurrentOrLastDayRecord: jest.fn(),
            findFirstRecordOfMonth: jest.fn(),
            calculateAverageValueOfMonth: jest.fn(),
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

    service = module.get<CurrenciesService>(CurrenciesService);
    repository = module.get('CurrencyRepository') as jest.Mocked<CurrencyRepository>;
    i18n = module.get<I18nService>(I18nService) as jest.Mocked<I18nService>;
  });

  describe('retrieveDetailsCurrencyIndicator', () => {
    it('debería devolver CurrencyResponseDto con datos válidos', async () => {
      const mockCurrentRecord: CurrencyDocument = {
        indicator: CurrenciesEnum.DOLAR,
        date: new Date('2024-09-17'),
        value: 923.37,
        value_to_word: 'novecientos veintitrés pesos con treinta y siete centavos',
        update_at: new Date(),
      } as CurrencyDocument;

      const mockFirstRecord: CurrencyDocument = {
        indicator: CurrenciesEnum.DOLAR,
        date: new Date('2024-09-01'),
        value: 913.99,
        value_to_word: 'novecientos trece pesos con noventa y nueve centavos',
        update_at: new Date(),
      } as CurrencyDocument;

      repository.findCurrentOrLastDayRecord.mockResolvedValue(mockCurrentRecord);
      repository.findFirstRecordOfMonth.mockResolvedValue(mockFirstRecord);
      repository.calculateAverageValueOfMonth.mockResolvedValue(918.68);

      i18n.t.mockImplementation((key: string) => {
        if (key === 'indicators.CURRENT_VALUE_NOTE') return 'Valor actualizado al día de hoy.';
        if (key === 'indicators.FIRST_DAY_MONTH_NOTE') return 'Valor del primer día del mes.';
        if (key === 'currencies.CURRENCY_NOT_FOUND') return 'Moneda no encontrada.';
        return '';
      });

      const result = await service.retrieveDetailsCurrencyIndicator(CurrenciesEnum.DOLAR);

      expect(result).toBeInstanceOf(CurrencyResponseDto);
      expect(result.currency).toBe(CurrenciesEnum.DOLAR);
      expect(result.average).toBe(918.68);
      expect(result.records).toHaveLength(2);

      const [current, first] = result.records;
      expect(current).toBeInstanceOf(IndicatorValueDto);
      expect(current.date).toBe('2024-09-17');
      expect(current.value).toBe(923.37);
      expect(current.details).toBe('novecientos veintitrés pesos con treinta y siete centavos');
      expect(current._note).toBe('Valor actualizado al día de hoy.');

      expect(first).toBeInstanceOf(IndicatorValueDto);
      expect(first.date).toBe('2024-09-01');
      expect(first.value).toBe(913.99);
      expect(first.details).toBe('novecientos trece pesos con noventa y nueve centavos');
      expect(first._note).toBe('Valor del primer día del mes.');
    });

    it('debería lanzar NotFoundException cuando no se encuentra el indicador actual', async () => {
      repository.findCurrentOrLastDayRecord.mockResolvedValue(null);

      i18n.t.mockImplementation((key: string, options?: any) => {
        if (key === 'currencies.CURRENCY_NOT_FOUND') {
          return `No se encontró el indicador para ${options.args.currency}`;
        }
        return '';
      });

      await expect(service.retrieveDetailsCurrencyIndicator(CurrenciesEnum.DOLAR)).rejects.toThrow(NotFoundException);

      expect(i18n.t).toHaveBeenCalledWith('currencies.CURRENCY_NOT_FOUND', {
        args: { currency: CurrenciesEnum.DOLAR },
      });
    });
  });
});

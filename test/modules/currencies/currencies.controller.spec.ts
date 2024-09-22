import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { CurrenciesController } from '@modules/currencies/currencies.controller';
import { CurrenciesService } from '@modules/currencies/currencies.service';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';
import { CurrencyResponseDto } from '@modules/currencies/dto/currency-response.dto';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: jest.Mocked<CurrenciesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrenciesController],
      providers: [
        {
          provide: CurrenciesService,
          useValue: {
            retrieveDetailsCurrencyIndicator: jest.fn(),
          },
        },
        {
          provide: I18nService,
          useValue: {
            t: jest.fn().mockReturnValue('some translation'),
          },
        },
        {
          provide: GlobalExceptionFilter,
          useValue: {
            catch: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CurrenciesController>(CurrenciesController);
    service = module.get(CurrenciesService) as jest.Mocked<CurrenciesService>;
  });

  describe('getCurrency', () => {
    it('should return a valid CurrencyResponseDto when service returns data', async () => {
      const currency = CurrenciesEnum.DOLAR;
      const mockResponse: CurrencyResponseDto = {
        currency: 'DOLAR',
        average: 932.78,
        records: [
          {
            date: '2024-09-17',
            value: 923.37,
            details: 'novecientos veintitrés pesos con treinta y siete centavos',
            _note: 'Valor actualizado al día de hoy.',
          },
          {
            date: '2024-09-01',
            value: 913.99,
            details: 'novecientos trece pesos con noventa y nueve centavos',
            _note: 'Valor del primer día del mes.',
          },
        ],
      };

      service.retrieveDetailsCurrencyIndicator.mockResolvedValue(mockResponse);

      const result = await controller.getCurrency(currency);

      expect(result).toEqual(mockResponse);
      expect(service.retrieveDetailsCurrencyIndicator).toHaveBeenCalledWith(currency);
    });

    it('should throw BadRequestException when invalid currency is provided', async () => {
      const invalidCurrency = 'YEN' as unknown as CurrenciesEnum;

      jest.spyOn(controller, 'getCurrency').mockImplementation(async () => {
        throw new BadRequestException('Divisa no válida o no soportada por la API.');
      });

      await expect(controller.getCurrency(invalidCurrency)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when no data is found for the currency', async () => {
      const currency = CurrenciesEnum.DOLAR;

      service.retrieveDetailsCurrencyIndicator.mockRejectedValue(
        new NotFoundException('No se encontraron registros para la divisa DOLAR en el periodo solicitado.'),
      );

      await expect(controller.getCurrency(currency)).rejects.toThrow(NotFoundException);
      expect(service.retrieveDetailsCurrencyIndicator).toHaveBeenCalledWith(currency);
    });
  });
});

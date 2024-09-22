import { Test, TestingModule } from '@nestjs/testing';
import { I18nService } from 'nestjs-i18n';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { EconomicsController } from '@modules/economics/economics.controller';
import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';

describe('EconomicsController', () => {
  let controller: EconomicsController;
  let service: jest.Mocked<EconomicsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EconomicsController],
      providers: [
        {
          provide: EconomicsService,
          useValue: {
            retrieveDetailsUFIndicator: jest.fn(),
            retrieveDetailsUTMIndicator: jest.fn(),
            retrieveDetailsIPCIndicator: jest.fn(),
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

    controller = module.get<EconomicsController>(EconomicsController);
    service = module.get(EconomicsService) as jest.Mocked<EconomicsService>;
  });

  describe('getIndicator', () => {
    it('should return UF indicator details when the indicator is UF', async () => {
      const indicator = EconomicsEnum.UF;
      const mockResponse = {
        indicator: 'UF',
        average: 37849.91,
        records: [
          {
            date: '2024-09-12',
            value: 37842.34,
            details: 'treinta y siete mil ochocientos cuarenta y dos pesos con treinta y cuatro céntimos',
            _note: 'Valor actualizado al día de hoy, o del último registro disponible.',
          },
          {
            date: '2024-09-01',
            value: 37762.97,
            details: 'treinta y siete mil setecientos sesenta y dos pesos con noventa y siete céntimos',
            _note: 'Valor del primer día del mes.',
          },
          {
            date: '2024-09-30',
            value: 37910.42,
            details: 'treinta y siete mil novecientos diez pesos con cuarenta y dos céntimos',
            _note: 'Valor del último día del mes, o el último valor registrado en el mes.',
          },
        ],
      };

      service.retrieveDetailsUFIndicator.mockResolvedValue(mockResponse);

      const result = await controller.getIndicator(indicator);

      expect(result).toEqual(mockResponse);
      expect(service.retrieveDetailsUFIndicator).toHaveBeenCalledWith(indicator);
    });

    it('should return UTM indicator details when the indicator is UTM', async () => {
      const indicator = EconomicsEnum.UTM;
      const mockResponse = {
        indicator: 'UTM',
        records: [
          {
            date: '2024-09-12',
            value: 66362,
            details: 'Sesenta y seis mil trescientos sesenta y dos pesos con cero céntimos',
            _note: 'Valor actualizado al día de hoy, o del último registro disponible.',
          },
        ],
      };

      service.retrieveDetailsUTMIndicator.mockResolvedValue(mockResponse);

      const result = await controller.getIndicator(indicator);

      expect(result).toEqual(mockResponse);
      expect(service.retrieveDetailsUTMIndicator).toHaveBeenCalledWith(indicator);
    });

    it('should return IPC indicator details when the indicator is IPC', async () => {
      const indicator = EconomicsEnum.IPC;
      const mockResponse = {
        indicator: 'IPC',
        accumulated: 12.34,
        accumulatedYearly: 123.45,
        records: [
          {
            date: '2024-09-01',
            value: 3.5,
            details: 'Índice de Precios al Consumidor (IPC)',
            _note: 'Valor actual del IPC',
          },
        ],
      };

      service.retrieveDetailsIPCIndicator.mockResolvedValue(mockResponse);

      const result = await controller.getIndicator(indicator);

      expect(result).toEqual(mockResponse);
      expect(service.retrieveDetailsIPCIndicator).toHaveBeenCalledWith(indicator);
    });

    it('should throw NotFoundException when no data is found for the indicator', async () => {
      const indicator = EconomicsEnum.UF;

      service.retrieveDetailsUFIndicator.mockRejectedValue(
        new NotFoundException('No se encontraron registros para el indicador económico UF en el periodo solicitado.'),
      );

      await expect(controller.getIndicator(indicator)).rejects.toThrow(NotFoundException);
      expect(service.retrieveDetailsUFIndicator).toHaveBeenCalledWith(indicator);
    });

    it('should throw BadRequestException when invalid indicator is provided', async () => {
      const invalidIndicator = 'INVALID' as unknown as EconomicsEnum;

      jest.spyOn(controller, 'getIndicator').mockImplementation(async () => {
        throw new BadRequestException('Indicador económico no válido o no soportado por la API.');
      });

      await expect(controller.getIndicator(invalidIndicator)).rejects.toThrow(BadRequestException);
    });
  });
});

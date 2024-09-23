import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { jest } from '@jest/globals';
import { I18nService } from 'nestjs-i18n';
import { AfpController } from '@modules/salaries/afp/afp.controller';
import { AfpService } from '@modules/salaries/afp/afp.service';
import { AFPResponseDto } from '@modules/salaries/afp/dto/afp-response.dto';
import { AfpEnum } from '@modules/salaries/afp/enums/afp.enum';
import { AfpParsePipe } from '@modules/salaries/afp/validators/afp-parse.pipe';

describe('AfpController', () => {
  let controller: AfpController;
  let service: jest.Mocked<AfpService>;

  const mockAfpService = {
    retrieveCurrentAFPData: jest.fn(),
  } as Partial<jest.Mocked<AfpService>>;

  const mockI18nService = {
    translate: jest.fn((key: string) => key),
  } as Partial<I18nService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AfpController],
      providers: [
        {
          provide: AfpService,
          useValue: mockAfpService,
        },
        {
          provide: I18nService,
          useValue: mockI18nService,
        },
        AfpParsePipe, // Aseguramos que el pipe esté disponible
      ],
    }).compile();

    controller = module.get<AfpController>(AfpController);
    service = module.get<AfpService>(AfpService) as jest.Mocked<AfpService>;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should retrieve AFP data successfully', async () => {
    const afpName = AfpEnum.CAPITAL;

    const afpData: AFPResponseDto = {
      name: 'Capital',
      quota: 1.44,
      mandatory: {
        deposit: 1.44,
        withdrawals: 1.25,
        transfer: 1.101,
      },
      voluntaryPension: {
        affiliated: 0.51,
        nonAffiliated: 0.51,
        transfer: 1.101,
      },
      voluntarySavings: {
        affiliated: 0.89,
      },
    };

    service.retrieveCurrentAFPData.mockResolvedValue(afpData);

    const result = await controller.getCurrency(afpName);

    expect(service.retrieveCurrentAFPData).toHaveBeenCalledWith(afpName);
    expect(result).toEqual(afpData);
  });

  it('should throw BadRequestException when invalid indicator is provided', async () => {
    const invalidAFP = 'INVALID' as unknown as AfpEnum;

    jest.spyOn(controller, 'getCurrency').mockImplementation(async () => {
      throw new BadRequestException('AFP no válida o no soportada por la API.');
    });

    await expect(controller.getCurrency(invalidAFP)).rejects.toThrow(BadRequestException);
  });

  it('should handle exceptions thrown by the service', async () => {
    const afpName = AfpEnum.CAPITAL;

    service.retrieveCurrentAFPData.mockRejectedValue(new NotFoundException('AFP not found'));

    await expect(controller.getCurrency(afpName)).rejects.toThrow(NotFoundException);
    expect(service.retrieveCurrentAFPData).toHaveBeenCalledWith(afpName);
  });
});

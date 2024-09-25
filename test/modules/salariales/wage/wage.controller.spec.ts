import { Test, TestingModule } from '@nestjs/testing';
import { WageController } from '@modules/salaries/wage/wage.controller';
import { WageService } from '@modules/salaries/wage/wage.service';
import { WageResponseDto } from '@modules/salaries/wage/dto/wage-response.dto';

describe('WageController', () => {
  let controller: WageController;
  let service: WageService;

  const mockWageService = {
    retrieveMinimumWage: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WageController],
      providers: [
        {
          provide: WageService,
          useValue: mockWageService,
        },
      ],
    }).compile();

    controller = module.get<WageController>(WageController);
    service = module.get<WageService>(WageService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return wage data successfully', async () => {
    const mockResponse: WageResponseDto = {
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
    };

    mockWageService.retrieveMinimumWage.mockResolvedValue(mockResponse);

    const result = await controller.getMinimumWage();

    expect(result).toEqual(mockResponse);
    expect(service.retrieveMinimumWage).toHaveBeenCalled();
  });

  it('should throw an error when service fails', async () => {
    const error = new Error('Database error');

    mockWageService.retrieveMinimumWage.mockRejectedValue(error);

    await expect(controller.getMinimumWage()).rejects.toThrow(error);
    expect(service.retrieveMinimumWage).toHaveBeenCalled();
  });
});

import { EconomicsController } from '@modules/economics/economics.controller';
import { EconomicsService } from '@modules/economics/economics.service';
import { EconomicsEnum } from '@modules/economics/enums/economics.enum';

describe('EconomicsController', () => {
  let controller: EconomicsController;
  let service: jest.Mocked<EconomicsService>;

  beforeEach(() => {
    service = { getIndicator: jest.fn() } as any;
    controller = new EconomicsController(service);
  });

  it('should delegate to service', async () => {
    const mockResponse = { indicator: 'UF', records: [] };
    service.getIndicator.mockResolvedValue(mockResponse);

    const result = await controller.getIndicator(EconomicsEnum.UF);
    expect(result).toEqual(mockResponse);
    expect(service.getIndicator).toHaveBeenCalledWith(EconomicsEnum.UF);
  });
});

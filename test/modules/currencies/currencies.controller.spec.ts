import { CurrenciesController } from '@modules/currencies/currencies.controller';
import { CurrenciesService } from '@modules/currencies/currencies.service';
import { CurrenciesEnum } from '@modules/currencies/enums/currencies.enum';

describe('CurrenciesController', () => {
  let controller: CurrenciesController;
  let service: jest.Mocked<CurrenciesService>;

  beforeEach(() => {
    service = {
      getIndicator: jest.fn(),
    } as any;
    controller = new CurrenciesController(service);
  });

  it('should call service.getIndicator', async () => {
    const mockResponse = { currency: 'DOLAR', records: [] };
    service.getIndicator.mockResolvedValue(mockResponse);

    const result = await controller.getIndicator(CurrenciesEnum.DOLAR);
    expect(result).toEqual(mockResponse);
    expect(service.getIndicator).toHaveBeenCalledWith(CurrenciesEnum.DOLAR);
  });
});

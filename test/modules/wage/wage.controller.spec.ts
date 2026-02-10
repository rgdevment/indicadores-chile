import { WageController } from '@modules/wage/wage.controller';
import { WageService } from '@modules/wage/wage.service';

describe('WageController', () => {
  let controller: WageController;
  let service: jest.Mocked<WageService>;

  beforeEach(() => {
    service = { getMinimumWage: jest.fn() } as any;
    controller = new WageController(service);
  });

  it('should delegate to service', async () => {
    const mockResponse = { current: { amount: 500000, date: '2026-01-01' }, historic: [] };
    service.getMinimumWage.mockResolvedValue(mockResponse as any);

    const result = await controller.getMinimumWage();
    expect(result.current.amount).toBe(500000);
  });
});

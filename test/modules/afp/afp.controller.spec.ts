import { AfpController } from '@modules/afp/afp.controller';
import { AfpService } from '@modules/afp/afp.service';
import { AfpEnum } from '@modules/afp/enums/afp.enum';

describe('AfpController', () => {
  let controller: AfpController;
  let service: jest.Mocked<AfpService>;

  beforeEach(() => {
    service = { getCommissions: jest.fn() } as any;
    controller = new AfpController(service);
  });

  it('should delegate to service', async () => {
    const mockResponse = { name: 'HABITAT' };
    service.getCommissions.mockResolvedValue(mockResponse as any);

    const result = await controller.getCommissions(AfpEnum.HABITAT);
    expect(result.name).toBe('HABITAT');
    expect(service.getCommissions).toHaveBeenCalledWith(AfpEnum.HABITAT);
  });
});

import { EconomicsParsePipe } from '@modules/economics/validators/economics-parse.pipe';
import { BadRequestException } from '@nestjs/common';

describe('EconomicsParsePipe', () => {
  const pipe = new EconomicsParsePipe();

  it('should accept valid indicators', () => {
    expect(pipe.transform('uf', {} as any)).toBe('UF');
    expect(pipe.transform('UTM', {} as any)).toBe('UTM');
    expect(pipe.transform('ipc', {} as any)).toBe('IPC');
  });

  it('should throw BadRequestException for invalid indicator', () => {
    expect(() => pipe.transform('INVALID', {} as any)).toThrow(BadRequestException);
  });
});

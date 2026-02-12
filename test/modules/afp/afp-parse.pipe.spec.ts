import { AfpParsePipe } from '@modules/afp/validators/afp-parse.pipe';
import { BadRequestException } from '@nestjs/common';

describe('AfpParsePipe', () => {
  const pipe = new AfpParsePipe();

  it('should accept valid AFP names (case insensitive)', () => {
    expect(pipe.transform('habitat', {} as any)).toBe('HABITAT');
    expect(pipe.transform('PROVIDA', {} as any)).toBe('PROVIDA');
    expect(pipe.transform('Uno', {} as any)).toBe('UNO');
  });

  it('should throw BadRequestException for invalid AFP', () => {
    expect(() => pipe.transform('UNKNOWN', {} as any)).toThrow(BadRequestException);
  });
});

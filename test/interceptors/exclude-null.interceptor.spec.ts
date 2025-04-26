import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { ExcludeNullInterceptor } from '@interceptors/exclude-null.interceptor';

describe('ExcludeNullInterceptor', () => {
  let interceptor: ExcludeNullInterceptor;

  beforeEach(() => {
    interceptor = new ExcludeNullInterceptor();
  });

  it('should not modify data without null or undefined properties', (done) => {
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () => of({ name: 'John', age: 30 }),
    };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({ name: 'John', age: 30 });
      done();
    });
  });

  it('should remove null and undefined properties', (done) => {
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () =>
        of({
          name: 'John',
          age: null,
          location: undefined,
          job: 'Developer',
        }),
    };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({ name: 'John', job: 'Developer' });
      done();
    });
  });

  it('should remove null and undefined properties from nested objects', (done) => {
    const context = {} as ExecutionContext;
    const callHandler: CallHandler = {
      handle: () =>
        of({
          name: 'John',
          address: {
            city: 'New York',
            zip: null,
            country: undefined,
          },
          age: null,
        }),
    };

    interceptor.intercept(context, callHandler).subscribe((result) => {
      expect(result).toEqual({
        name: 'John',
        address: {
          city: 'New York',
        },
      });
      done();
    });
  });
});

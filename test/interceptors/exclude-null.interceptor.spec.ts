import { ExcludeNullInterceptor } from '@interceptors/exclude-null.interceptor';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';

describe('ExcludeNullInterceptor', () => {
  let interceptor: ExcludeNullInterceptor;

  beforeEach(() => {
    interceptor = new ExcludeNullInterceptor();
  });

  const mockContext = {} as ExecutionContext;
  const createHandler = (data: unknown): CallHandler => ({
    handle: () => of(data),
  });

  it('should remove null properties', done => {
    const handler = createHandler({ a: 1, b: null, c: 'hello' });
    interceptor.intercept(mockContext, handler).subscribe(result => {
      expect(result).toEqual({ a: 1, c: 'hello' });
      done();
    });
  });

  it('should remove undefined properties', done => {
    const handler = createHandler({ a: 1, b: undefined });
    interceptor.intercept(mockContext, handler).subscribe(result => {
      expect(result).toEqual({ a: 1 });
      done();
    });
  });

  it('should handle nested objects', done => {
    const handler = createHandler({ a: { b: null, c: 1 }, d: 'test' });
    interceptor.intercept(mockContext, handler).subscribe(result => {
      expect(result).toEqual({ a: { c: 1 }, d: 'test' });
      done();
    });
  });

  it('should handle arrays', done => {
    const handler = createHandler([{ a: null, b: 1 }, { c: 2 }]);
    interceptor.intercept(mockContext, handler).subscribe(result => {
      expect(result).toEqual([{ b: 1 }, { c: 2 }]);
      done();
    });
  });

  it('should pass through primitives', done => {
    const handler = createHandler(42);
    interceptor.intercept(mockContext, handler).subscribe(result => {
      expect(result).toBe(42);
      done();
    });
  });
});

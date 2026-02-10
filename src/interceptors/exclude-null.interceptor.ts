import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(map(data => this.stripNulls(data)));
  }

  private stripNulls(value: unknown): unknown {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (Array.isArray(value)) {
      return value.map(item => this.stripNulls(item));
    }
    if (typeof value === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
        const cleaned = this.stripNulls(val);
        if (cleaned !== undefined) {
          result[key] = cleaned;
        }
      }
      return result;
    }
    return value;
  }
}

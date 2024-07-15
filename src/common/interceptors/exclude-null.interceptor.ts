import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.transformResponse(data)));
  }

  private transformResponse(data: any): any {
    return this.removeNullAndUndefinedProperties(data);
  }

  private removeNullAndUndefinedProperties(obj: any): any {
    if (Array.isArray(obj)) {
      return obj.map(item => this.removeNullAndUndefinedProperties(item));
    } else if (obj !== null && typeof obj === 'object') {
      return Object.keys(obj).reduce((acc, key) => {
        const value = obj[key];
        if (value !== null && value !== undefined) {
          acc[key] = this.removeNullAndUndefinedProperties(value);
        }
        return acc;
      }, {});
    }
    return obj;
  }
}

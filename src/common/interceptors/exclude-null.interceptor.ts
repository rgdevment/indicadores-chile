import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map(data => this.transformResponse(data)));
  }

  private transformResponse(data: any): any {
    const result = this.removeNullAndUndefinedProperties(data);
    return instanceToPlain(result);
  }

  private removeNullAndUndefinedProperties(obj: any): any {
    Object.keys(obj).forEach(key => {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      } else if (typeof obj[key] === 'object') {
        this.removeNullAndUndefinedProperties(obj[key]);
      }
    });
    return obj;
  }
}

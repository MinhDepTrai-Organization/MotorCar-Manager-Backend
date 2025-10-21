import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const { message, data, pagination } = response;
        if (response?.status !== undefined) {
          return response;
        }

        if (pagination) {
          return {
            status: 200,
            message: message ?? 'Thành công',
            pagination,
            data: data ?? response,
          };
        }
        return {
          status: 200,
          message: message ?? 'Thành công',
          data: data ?? response,
        };
      }),
    );
  }
}

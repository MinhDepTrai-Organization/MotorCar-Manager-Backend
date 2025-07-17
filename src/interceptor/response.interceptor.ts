import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
            status: 200, // Mặc định 200
            message: message ?? 'Thành công', // Nếu có message từ service thì dùng, nếu không thì mặc định
            pagination,
            data: data ?? response, // Nếu service trả về { message, data }, thì lấy data. Nếu chỉ trả về object, thì lấy object luôn.
          };
        }
        return {
          status: 200, // Mặc định 200
          message: message ?? 'Thành công', // Nếu có message từ service thì dùng, nếu không thì mặc định
          data: data ?? response, // Nếu service trả về { message, data }, thì lấy data. Nếu chỉ trả về object, thì lấy object luôn.
        };
      }),
    );
  }
}

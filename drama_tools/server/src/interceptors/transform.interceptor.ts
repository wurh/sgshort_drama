import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';
import { NO_ENVELOPE } from '../decorators/no-envelope.decorator';

/** 统一响应：{ code, msg, data }。 */
export interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    // SSE / 手动 res 端点（标记 @NoEnvelope）：保持原始流，不包信封
    if (Reflect.getMetadata(NO_ENVELOPE, context.getHandler()) === true) {
      return next.handle() as unknown as Observable<ApiResponse<T>>;
    }
    return next.handle().pipe(
      map((data) => ({
        code: 0,
        msg: 'ok',
        data,
      })),
    );
  }
}

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response, Request } from 'express';

/** 全局异常过滤器：统一 { code, msg, data:null }，不泄露堆栈。 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let code: number = status;
    let msg = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      code = status;
      const body = exception.getResponse();
      msg =
        typeof body === 'string'
          ? body
          : ((body as Record<string, any>)?.message?.toString() ??
            exception.message);
      if (Array.isArray((body as Record<string, any>)?.message)) {
        msg = (body as Record<string, any>).message.join('; ');
      }
    } else if (exception instanceof Error) {
      msg = exception.message || msg;
      // 业务错误码（BizError）：携带自定义 code 与 httpStatus
      const biz = exception as unknown as { code?: number; httpStatus?: number };
      if (typeof biz.code === 'number' && (exception.name === 'BizError' || exception.name === 'HttpError')) {
        code = biz.code;
        status = biz.httpStatus ?? status;
      }
    }

    if (status >= 500) {
      this.logger.error(
        `${req.method} ${req.url} => ${status}`,
        exception instanceof Error ? exception.stack : String(exception),
      );
    }

    res.status(status).json({ code, msg, data: null });
  }
}

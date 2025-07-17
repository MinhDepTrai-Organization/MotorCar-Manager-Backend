import {
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DEFAULT_ERROR_MESSAGE } from 'src/constants/defaultErrorResponse';
import { ErrorResponseBody } from 'src/constants/defaultErrorResponse';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const responseObj: ErrorResponseBody = {
      success: false,
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      message: DEFAULT_ERROR_MESSAGE,
    };

    if (exception instanceof HttpException) {
      responseObj.status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const { message } = exceptionResponse as Record<string, any>;
      responseObj.message = message;
    } else {
      const errorMessage =
        exception instanceof Error ? exception.message : DEFAULT_ERROR_MESSAGE;
      responseObj.message = errorMessage;
    }

    response.status(responseObj.status).json(responseObj);
    super.catch(exception, host);
  }
}

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AppExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();

    const statusCode = exception.getStatus();
    const response = exception.getResponse() as { statusCode: number; message: string | string[]; error: string };
    const message = Array.isArray(response.message) ? response.message[0] : response.message;

    // TODO: customize your own error handler
    if (statusCode === HttpStatus.PAYMENT_REQUIRED) {
      return res.status(402).json({ statusCode: 402, message: 'Payment Required' });
    }
    // ======================================
    // ! Display log in server. Can also integrate with Mailer if want to alert to developer
    if (statusCode >= 500) {
      console.error(exception);
    } else {
      console.log(response);
    }
    if (response.statusCode) {
      res.status(statusCode).json({ statusCode: response.statusCode, message: message });
    } else {
      res.status(statusCode).json({ statusCode: statusCode, message: response });
    }
  }
}

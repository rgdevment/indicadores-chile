import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Response } from 'express';
import { I18nService } from 'nestjs-i18n';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly i18n: I18nService) {}

  async catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      response
        .status(status)
        .json(
          typeof exceptionResponse === 'string'
            ? { statusCode: status, message: exceptionResponse }
            : exceptionResponse,
        );
      return;
    }

    this.logger.error('Unexpected error', exception instanceof Error ? exception.stack : String(exception));

    const message = await this.i18n.t('globals.UNEXPECTED_ERROR');
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: message,
    });
  }
}

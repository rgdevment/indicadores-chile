import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

describe('GlobalExceptionFilter', () => {
  let filter: GlobalExceptionFilter;
  let mockI18n: Partial<I18nService>;
  let mockResponse: { status: jest.Mock; json: jest.Mock };
  let mockHost: any;

  beforeEach(() => {
    mockI18n = {
      t: jest.fn().mockResolvedValue('Ocurrió un error inesperado'),
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => ({}),
      }),
    };
    filter = new GlobalExceptionFilter(mockI18n as I18nService);
  });

  it('should handle HttpException', async () => {
    const exception = new HttpException('Not Found', HttpStatus.NOT_FOUND);
    await filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(404);
  });

  it('should handle HttpException with object response', async () => {
    const exception = new HttpException({ statusCode: 400, message: 'Bad Request' }, HttpStatus.BAD_REQUEST);
    await filter.catch(exception, mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: 400,
      message: 'Bad Request',
    });
  });

  it('should handle unexpected errors with i18n message', async () => {
    await filter.catch(new Error('crash'), mockHost);
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockI18n.t).toHaveBeenCalledWith('globals.UNEXPECTED_ERROR');
  });
});

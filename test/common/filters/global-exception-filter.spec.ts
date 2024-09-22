import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { Logger } from '@nestjs/common';
import { GlobalExceptionFilter } from '../../../src/filters/global-exception.filter';

describe('GlobalExceptionFilter', () => {
  let exceptionFilter: GlobalExceptionFilter;
  let i18nService: I18nService;
  let mockArgumentsHost: ArgumentsHost;
  let mockResponse: any;
  let mockRequest: any;
  let loggerErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    i18nService = { t: jest.fn().mockReturnValue('An unexpected error occurred') } as unknown as I18nService;
    exceptionFilter = new GlobalExceptionFilter(i18nService);

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    mockRequest = {
      url: '/test',
      method: 'GET',
    };

    mockArgumentsHost = {
      switchToHttp: jest.fn().mockReturnValue({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    loggerErrorSpy = jest.spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle HttpException correctly', () => {
    const exception = new HttpException('Forbidden', HttpStatus.FORBIDDEN);

    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.FORBIDDEN);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.FORBIDDEN,
      timestamp: expect.any(String),
      path: '/test',
      method: 'GET',
      message: 'Forbidden',
    });
    expect(i18nService.t).not.toHaveBeenCalled();
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });

  it('should handle unexpected exception correctly and log it', () => {
    const exception = new Error('Something went wrong');

    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: expect.any(String),
      path: '/test',
      method: 'GET',
      message: 'An unexpected error occurred',
    });
    expect(i18nService.t).toHaveBeenCalledWith('globals.UNEXPECTED_ERROR');
    expect(loggerErrorSpy).toHaveBeenCalledWith(
      'Unexpected error occurred: Error: Something went wrong',
      expect.any(String),
    );
  });

  it('should handle HttpException with custom message', () => {
    const exception = new HttpException('Custom message', HttpStatus.BAD_REQUEST);

    exceptionFilter.catch(exception, mockArgumentsHost);

    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST);
    expect(mockResponse.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.BAD_REQUEST,
      timestamp: expect.any(String),
      path: '/test',
      method: 'GET',
      message: 'Custom message',
    });
    expect(i18nService.t).not.toHaveBeenCalled();
    expect(loggerErrorSpy).not.toHaveBeenCalled();
  });
});

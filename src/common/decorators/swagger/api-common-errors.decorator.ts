import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

interface ApiCommonErrorsOptions {
  resourceName: string;
  invalidExampleValue: string;
  notFoundExampleValue: string;
  basePath: string;
}

export function ApiCommonErrors(options: ApiCommonErrorsOptions) {
  const { resourceName, invalidExampleValue, notFoundExampleValue, basePath } = options;

  return applyDecorators(
    ApiResponse({
      status: 400,
      description: `${capitalize(resourceName)} no válido o no soportado por la API.`,
      content: {
        'application/json': {
          example: {
            statusCode: 400,
            timestamp: '2024-09-22T02:26:46.808Z',
            path: `${basePath}/${invalidExampleValue}`,
            method: 'GET',
            message: `${invalidExampleValue.toUpperCase()} no es un ${resourceName} soportado por nuestra API.`,
          },
        },
      },
    }),
    ApiResponse({
      status: 404,
      description: `Datos no encontrados para el ${resourceName} solicitado.`,
      content: {
        'application/json': {
          example: {
            statusCode: 404,
            timestamp: '2024-09-22T02:26:46.808Z',
            path: `${basePath}/${notFoundExampleValue}`,
            method: 'GET',
            message: `No se encontraron registros para el ${resourceName} ${notFoundExampleValue.toUpperCase()} en el 
                      periodo solicitado.`,
          },
        },
      },
    }),
  );
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

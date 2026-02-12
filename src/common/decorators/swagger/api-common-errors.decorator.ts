import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiNotFoundResponse } from '@nestjs/swagger';

export function ApiCommonErrors() {
  return applyDecorators(
    ApiBadRequestResponse({ description: 'Parámetro inválido o no soportado' }),
    ApiNotFoundResponse({ description: 'No se encontró información para el indicador solicitado' }),
  );
}

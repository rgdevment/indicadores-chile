# API de Indicadores Económicos y Financieros de Chile

[![Build CI](https://github.com/rgdevment/indicadores-chile/actions/workflows/main.yml/badge.svg)](https://github.com/rgdevment/indicadores-chile/actions/workflows/main.yml)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_indicadores-chile&metric=coverage)](https://sonarcloud.io/dashboard?id=rgdevment_indicadores-chile)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_indicadores-chile&metric=alert_status)](https://sonarcloud.io/dashboard?id=rgdevment_indicadores-chile)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Este proyecto proporciona una API REST gratuita y de código abierto para consultar indicadores económicos y financieros de Chile, tales como la UF, IPC, UTM, tasas de cambio y otros. Está desarrollada en [NestJS](https://nestjs.com/) y hospedada en [Cloud Run](https://cloud.google.com/run).

## Endpoints disponibles (Leer documentación)

### Indicadores Económicos y Financieros (Ejemplos)

- **UF**: Unidad de Fomento (UF) actualizada diariamente.
    - GET https://indicadores.apirest.cl/v1/uf

- **IPC**: Índice de Precios al Consumidor (IPC).
    - GET https://indicadores.apirest.cl/v1/ipc

- **Dólar**: Tasa de cambio del dólar.
    - GET https://indicadores.apirest.cl/v1/dolar

Entre otros indicadores económicos, financieros, divisas y salariales, incluyendo:

- **UTM**: Unidad Tributaria Mensual
- **Sueldo Mínimo**: Último valor del sueldo mínimo

## Uso del API REST

### Cómo usar la API REST

Puedes hacer peticiones HTTP a los endpoints proporcionados para obtener datos de indicadores económicos actualizados.

### Ejemplo de uso

Aquí tienes un ejemplo en `curl` para obtener el valor de la UF:

	curl https://indicadores.apirest.cl/v1/uf

### Recomendaciones

- Asegúrate de manejar correctamente las respuestas HTTP.
- Los datos son actualizados diariamente, por lo que siempre tendrás acceso a la información más reciente.
- Usa librerías como `axios`, `fetch` o similares para integrar el API en tus proyectos.

## Instrucciones para instalación local

Si quieres probar el proyecto localmente o montarlo en tu propio entorno, sigue estos pasos.

### Requisitos

- **Node.js**: 20.x LTS
- **Yarn**: 4.4

### Instalación

1. Clona el repositorio:
    - git clone https://github.com/tu-usuario/indicadores-chile.git
    - cd indicadores-chile

2. Instala las dependencias:
    - yarn install

3. Configura las variables de entorno:
    - cp .env.example .env
    - Edita el archivo `.env` con tus propios valores.

4. Ejecuta el proyecto:
    - yarn start:dev

Este comando levantará la API en un entorno de desarrollo.

### Despliegue en Producción

Si deseas desplegar esta API en producción, sigue los siguientes pasos:

1. Genera el build del proyecto:
    - yarn build

2. Ejecuta la aplicación en producción:
    - yarn start:prod

El proyecto está configurado para ser desplegado automáticamente en [Google Cloud Run](https://cloud.google.com/run) utilizando GitHub Actions para integración continua y despliegue continuo.

## Donaciones

Este proyecto es mantenido de manera gratuita para todos. Si encuentras útil esta API y deseas apoyar el mantenimiento, puedes contribuir con una donación voluntaria.

Las donaciones se destinarán exclusivamente a cubrir los costos de infraestructura, que incluyen:

- **Clusters en Google Cloud Run**: Este es el servicio que aloja y ejecuta la API. Los costos incluyen el uso de CPU, memoria y tiempo de ejecución de la API.
- **Dominio**: Los costos del registro y mantenimiento del dominio `apirest.cl` y `restapi.cl`.
- **Almacenamiento**: En caso de que sea necesario, se cubrirán los costos de almacenamiento en bases de datos externas o servicios asociados.
- **Tráfico de red**: Cualquier costo adicional relacionado con el uso de red y transferencia de datos.
- **Certificados SSL**: Si es necesario, parte de los fondos se destinarán a la compra o renovación de certificados SSL para asegurar las conexiones.

¡Cualquier aporte es bienvenido y ayudará a mantener el servicio activo y disponible para todos!


[¡Haz tu donación aquí!](https://tu-enlace-de-donaciones)

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

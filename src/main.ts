import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, RequestMethod } from '@nestjs/common';
import { ExcludeNullInterceptor } from '@interceptors/exclude-null.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('v1', {
    exclude: [
      { path: 'health', method: RequestMethod.GET },
      { path: 'metrics', method: RequestMethod.GET },
    ],
  });
  app.useGlobalInterceptors(new ExcludeNullInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Indicadores Chile API')
    .setDescription('API Open-Source con Indicadores económicos, financieros, previsionales y salariales para CHILE')
    .setVersion('1.1')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1', app, document);
  SwaggerModule.setup('v1/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap().then();

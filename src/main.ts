import { GlobalExceptionFilter } from '@filters/global-exception.filter';
import { ExcludeNullInterceptor } from '@interceptors/exclude-null.interceptor';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { I18nService } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.setGlobalPrefix('v1', {
    exclude: ['health'],
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalInterceptors(new ExcludeNullInterceptor());

  const i18n = app.get<I18nService>(I18nService);
  app.useGlobalFilters(new GlobalExceptionFilter(i18n as any));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Indicadores Chile API')
    .setDescription('API Open-Source con indicadores economicos, financieros, previsionales y salariales para Chile')
    .setVersion('2.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('Divisas', 'Indicadores de divisas (Dolar, Euro)')
    .addTag('Economicos', 'Indicadores economicos (UF, UTM, IPC)')
    .addTag('AFP', 'Comisiones AFP')
    .addTag('Salarios', 'Salario minimo')
    .addTag('Health', 'Estado del servicio')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  Logger.log('Application running on http://localhost:' + String(port), 'Bootstrap');
}

bootstrap();

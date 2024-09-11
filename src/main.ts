import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExcludeNullInterceptor } from './common/interceptors/exclude-null.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });

  app.useGlobalInterceptors(new ExcludeNullInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Indicadores Chile API')
    .setDescription('API Open-Source con Indicadores económicos, financieros, previsionales y salariales para CHILE')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(`Application is running on: http://localhost:${port}`, 'Bootstrap');
}
bootstrap().then();

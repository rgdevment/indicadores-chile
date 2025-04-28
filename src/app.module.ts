import { Module } from '@nestjs/common';
import { join } from 'path';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CurrenciesModule } from '@modules/currencies/currencies.module';
import { EconomicsModule } from '@modules/economics/economics.module';
import { SalariesModule } from '@modules/salaries/salaries.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { collectDefaultMetrics, Registry } from 'prom-client';
import { HealthController } from './common/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: {
        path: join(__dirname, '/resources/i18n/'),
        watch: false,
      },
      resolvers: [new HeaderResolver([])],
    }),
    PrometheusModule.register(),
    CurrenciesModule,
    EconomicsModule,
    SalariesModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: 'PrometheusRegistry',
      useValue: (() => {
        const registry = new Registry();
        collectDefaultMetrics({ register: registry });
        return registry;
      })(),
    },
  ],
})
export class AppModule {}

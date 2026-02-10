import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';

import { HealthController } from '@common/controllers/health.controller';
import { AfpModule } from '@modules/afp/afp.module';
import { CurrenciesModule } from '@modules/currencies/currencies.module';
import { EconomicsModule } from '@modules/economics/economics.module';
import { WageModule } from '@modules/wage/wage.module';

import {
  AfpEntity,
  IndicatorSubtypeEntity,
  IndicatorTypeEntity,
  IndicatorValueEntity,
  WageEntity,
} from '@entities/index';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql' as const,
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 3306),
        username: config.get<string>('DB_USERNAME', 'root'),
        password: config.get<string>('DB_PASSWORD') ?? '',
        database: config.get<string>('DB_DATABASE', 'indicadores_chile'),
        entities: [IndicatorTypeEntity, IndicatorSubtypeEntity, IndicatorValueEntity, AfpEntity, WageEntity],
        synchronize: config.get<string>('DB_SYNC', 'false') === 'true',
        logging: config.get<string>('DB_LOGGING', 'false') === 'true',
      }),
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => {
        const redisUrl = config.get<string>('REDIS_URL');
        if (redisUrl) {
          const { redisStore } = await import('cache-manager-ioredis-yet');
          return {
            store: redisStore,
            url: redisUrl,
            ttl: config.get<number>('CACHE_TTL', 3600) * 1000,
          };
        }
        return { ttl: config.get<number>('CACHE_TTL', 3600) * 1000 };
      },
    }),

    I18nModule.forRoot({
      fallbackLanguage: 'es',
      loaderOptions: { path: join(__dirname, '/resources/i18n/'), watch: false },
      resolvers: [new HeaderResolver(['x-lang'])],
    }),

    CurrenciesModule,
    EconomicsModule,
    AfpModule,
    WageModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}

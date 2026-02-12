import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';

import { HealthController } from '@common/controllers/health.controller';
import { AfpModule } from '@modules/afp/afp.module';
import { CurrenciesModule } from '@modules/currencies/currencies.module';
import { EconomicsModule } from '@modules/economics/economics.module';
import { WageModule } from '@modules/wage/wage.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),

    DatabaseModule,

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get<number>('CACHE_TTL', 3600) * 1000,
        max: config.get<number>('CACHE_MAX', 500),
      }),
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

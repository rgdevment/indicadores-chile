import { Global, Inject, Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import SQLite from 'better-sqlite3';
import { existsSync, mkdirSync } from 'fs';
import { Kysely, SqliteDialect } from 'kysely';
import { dirname } from 'path';

import { Database } from './database.types';
import { createSchema } from './schema';

export const KYSELY = Symbol('KYSELY');

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: KYSELY,
      inject: [ConfigService],
      useFactory: (config: ConfigService): Kysely<Database> => {
        const dbPath = config.get<string>('DB_PATH', './data/indicadores.db');
        const isProd = config.get<string>('NODE_ENV') === 'production';

        if (isProd && !existsSync(dbPath)) {
          throw new Error(`Base de datos no encontrada en ${dbPath}. En producción la DB debe existir previamente.`);
        }

        const dir = dirname(dbPath);
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

        const sqlite = new SQLite(dbPath);
        sqlite.pragma('journal_mode = WAL');
        sqlite.pragma('foreign_keys = ON');
        sqlite.pragma('busy_timeout = 5000');

        return new Kysely<Database>({
          dialect: new SqliteDialect({ database: sqlite }),
        });
      },
    },
  ],
  exports: [KYSELY],
})
export class DatabaseModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(DatabaseModule.name);

  constructor(
    @Inject(KYSELY) private readonly db: Kysely<Database>,
    private readonly config: ConfigService,
  ) {}

  async onModuleInit(): Promise<void> {
    const isProd = this.config.get<string>('NODE_ENV') === 'production';

    if (!isProd) {
      await createSchema(this.db);
      this.logger.log('Schema creado/verificado (modo desarrollo)');
    }

    this.logger.log('Base de datos SQLite conectada');
  }

  async onModuleDestroy(): Promise<void> {
    await this.db.destroy();
  }
}

import SQLite from 'better-sqlite3';
import { Kysely, SqliteDialect } from 'kysely';
import { DB } from './schema';

export const db = new Kysely<DB>({
  dialect: new SqliteDialect({
    database: new SQLite('database.sqlite'),
  }),
});

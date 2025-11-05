import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as url from 'url';

dotenv.config();

const dbUrl = process.env.DATABASE_URL;

let dataSourceOptions;

if (dbUrl) {
  const parsed = new url.URL(dbUrl);

  dataSourceOptions = {
    type: 'mysql' as const,
    host: parsed.hostname,
    port: parseInt(parsed.port, 10),
    username: parsed.username,
    password: parsed.password,
    database: parsed.pathname.replace('/', ''),
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  };
} else {
  dataSourceOptions = {
    type: 'mysql' as const,
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'RIMS',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  };
}

export default new DataSource(dataSourceOptions);

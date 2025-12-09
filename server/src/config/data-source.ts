import { DataSource } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Auth } from 'src/auth/entities/auth.entity';
import { config } from 'dotenv';

import { Notification } from 'src/notification/entities/notification.entity';
import { Divisi } from 'src/divisi/entities/divisi.entity';
import { AuditLog } from 'src/audit-log/entities/audit-log.entity';
config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [User, Auth, Notification, AuditLog, Divisi],
  migrations: ['src/migrations/*.ts'],
});

import { DataSource } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Auth } from '../auth/entities/auth.entity';
import { config } from 'dotenv';
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
  entities: [User, Auth],
});

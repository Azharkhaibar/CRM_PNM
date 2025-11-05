import 'dotenv/config';
import mysql from 'mysql2/promise';

export const initDb = async () => {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL ?? 'mysql://root:@localhost:3306/magangpnm',
  );
 
};

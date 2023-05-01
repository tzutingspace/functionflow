import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST, // 如果用localhost 會出現error
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 20,
    idleTimeout: 60000,
    timezone: process.env.MYSQL_TIMEZONE, // 從mysql拉出來的date不改變成本地時間
  })
  .promise();

export default pool;

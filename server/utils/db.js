import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const { MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE } = process.env;

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST, // 如果用localhost 會出現error
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise();

export { pool };

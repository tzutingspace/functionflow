import pool from '../utils/db.js';

// 依據email 查是否有該用戶
export async function getUser(email) {
  const [rows] = await pool.query(
    `
    SELECT id, email, password, name FROM users
    WHERE email = ?
    `,
    [email]
  );
  return rows[0];
}

// 註冊
export async function createUser(name, email, password, provider) {
  const [result] = await pool.query(
    `
    INSERT INTO users (name, email, password, provider)
    VALUES (?, ?, ?, ?)
    `,
    [name, email, password, provider]
  );
  console.debug('@model createUser, Result:', result);
  return getUser(email);
}

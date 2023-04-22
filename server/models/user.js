import pool from '../utils/db.js';

// 依據email 查是否有該用戶
export async function getUser(email) {
  const [rows] = await pool.query(
    `
    SELECT * FROM users
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
  console.log('@model createUser, Result:', result);
  return getUser(email);
}

// // 確認權限
// export async function checkAuth(email) {
//   const [result] = await pool.query(
//     `
//     SELECT
//       users_roles.user_id AS user_id,
//       roles.role_name,
//       permissions.permission_name
//     FROM users_roles
//       LEFT JOIN roles ON users_roles.role_id = roles.id
//       LEFT JOIN roles_permissions ON roles.id = roles_permissions.role_id
//       LEFT JOIN permissions ON roles_permissions.permission_id = permissions.id
//     WHERE user_id = (
//         SELECT id
//         FROM users
//         WHERE
//             email = ?
//       )
//     `,
//     [email]
//   );
//   return result;
// }

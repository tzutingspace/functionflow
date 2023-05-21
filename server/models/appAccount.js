import pool from '../utils/db.js';

export async function getAppAccountsByUserId(userId) {
  const [rows] = await pool.query(
    `
    SELECT
    app_accounts.name,
    app_accounts.identity,
    app_accounts.information,
    app_accounts.workflow_id
    FROM app_accounts
    WHERE app_accounts.user_id = ?
    `,
    [userId]
  );
  return rows;
}

export async function searchAppAccount(appInfo, conn = pool) {
  const { userId, appName, appIdentity } = appInfo;
  const [rows] = await conn.query(
    `
    SELECT id FROM app_accounts 
    WHERE user_id = ? 
      AND name = ? 
      AND identity = ?
  `,
    [userId, appName, appIdentity]
  );
  return rows[0];
}

export async function insertAppAccount(appInfo, conn = pool) {
  const { userId, appName, appIdentity, appInformation } = appInfo;
  const [rows] = await conn.query(
    `
    INSERT INTO
    app_accounts (
      user_id,
      name,
      identity,
      information
    )
    VALUES (
    ?, ?, ?, ?
  )
    `,
    [userId, appName, appIdentity, appInformation]
  );
  return rows;
}

export async function updateAppAccount(appInfo, conn = pool) {
  const { id, appInformation } = appInfo;
  const [rows] = await conn.query(
    `
    UPDATE app_accounts
    SET information = ?
    WHERE id = ?
    `,
    [appInformation, id]
  );
  return rows;
}

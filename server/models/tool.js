import { pool } from '../utils/db.js';

async function getTools() {
  const [rows] = await pool.query(`SELECT * FROM \`functions\``);
  return rows;
}

export { getTools };

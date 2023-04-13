import pool from '../utils/db.js';

async function getTools(requriement = {}) {
  const condition = { sql: '', binding: [] };
  if (requriement.id != null) {
    condition.sql = 'WHERE id = ?';
    condition.binding = [requriement.id];
  }

  const toolsQuery = `SELECT * FROM \`functions\`${condition.sql} ORDER BY id`;

  const [rows] = await pool.query(toolsQuery, condition.binding);
  return rows;
}

export { getTools };

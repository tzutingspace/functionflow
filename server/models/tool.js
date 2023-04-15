import pool from '../utils/db.js';

async function getTools(requriement = {}) {
  const condition = { sql: '', binding: [] };
  if (requriement.id != null) {
    condition.sql = 'WHERE id = ?';
    condition.binding = [requriement.id];
  } else if (requriement.type != null) {
    condition.sql = 'WHERE type = ?';
    condition.binding = [requriement.type];
  } else if (requriement.keyword != null) {
    condition.sql = 'WHERE title LIKE ?';
    condition.binding = [`%${requriement.keyword}%`];
  }
  const toolsQuery = `SELECT * FROM \`functions\`${condition.sql} ORDER BY id`;
  const [rows] = await pool.query(toolsQuery, condition.binding);
  return rows;
}

export { getTools };

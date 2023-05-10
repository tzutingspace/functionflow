import pool from '../utils/db.js';

async function getTriggers(requirement = {}) {
  console.log('@ models getTriggers', requirement);
  const condition = { sql: '', binding: [] };
  if (requirement.id != null) {
    condition.sql = 'WHERE id = ?';
    condition.binding = [requirement.id];
  } else if (requirement.type != null) {
    condition.sql = 'WHERE type = ?';
    condition.binding = [requirement.type];
  } else if (requirement.keyword != null) {
    condition.sql = 'WHERE external_name LIKE ?';
    condition.binding = [`%${requirement.keyword}%`];
  }
  const triggersQuery = `SELECT * FROM \`trigger_functions\`${condition.sql} ORDER BY id`;
  const [rows] = await pool.query(triggersQuery, condition.binding);
  return rows;
}

async function getTools(requirement = {}) {
  const condition = { sql: '', binding: [] };
  if (requirement.id != null) {
    condition.sql = 'WHERE id = ?';
    condition.binding = [requirement.id];
  } else if (requirement.type != null) {
    condition.sql = 'WHERE type = ?';
    condition.binding = [requirement.type];
  } else if (requirement.keyword != null) {
    condition.sql = 'WHERE title LIKE ?';
    condition.binding = [`%${requirement.keyword}%`];
  }
  const toolsQuery = `SELECT * FROM \`functions\`${condition.sql} ORDER BY type`;
  const [rows] = await pool.query(toolsQuery, condition.binding);
  return rows;
}

export { getTriggers, getTools };

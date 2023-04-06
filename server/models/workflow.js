import { pool } from '../utils/db.js';

async function getWorkflowById(id) {
  const [rows] = await pool.query(`SELECT * FROM workflows WHERE id = ?`, [id]);
  return rows[0];
}

async function insertWorkflow(info) {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query(`
      INSERT INTO workflows(user_id, workflow_status, start_time, trigger_type,
         trigger_interval, next_execute_time, tigger_api_route, job_number, trigger_interval_minutes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
  } catch (error) {}
}

export { getWorkflowById, insertWorkflow };

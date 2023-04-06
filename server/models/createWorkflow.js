import { pool } from '../utils/db.js';

async function getWorkflow() {
  const id = 1;
  const [rows] = await pool.query(
    `SELECT * 
    FROM workflows
    WHERE id = ?
    `,
    [id]
  );
  return rows[0];
}

console.log(await getWorkflow());

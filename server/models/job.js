import pool from '../utils/db.js';

// create Job
export async function createJob(workflowId, necessaryInfo = {}) {
  const [result] = await pool.query(
    `INSERT INTO jobs(workflow_id, name, function_id, sequence, customer_input) 
      VALUES (?, ?, ?, ?, ?)`,
    [
      workflowId,
      necessaryInfo.name,
      necessaryInfo.function_id,
      necessaryInfo.sequence,
      necessaryInfo.customer_input,
    ]
  );
  console.debug(`新增Job 成功 ID 為`, result.insertId);
  return result.insertId;
}

// update Job
export async function updateJob(jobId, necessaryInfo = {}) {
  console.debug('@updateJob models');

  // remove undefined key
  const sqlParams = Object.entries(necessaryInfo).reduce(
    (acc, [key, value]) => {
      if (value) {
        acc.sql.push(`${key} = ?`);
        acc.bindings.push(value);
      }
      return acc;
    },
    { sql: [], bindings: [] }
  );
  sqlParams.bindings.push(jobId);

  const jobUpdateSQL = `
    UPDATE jobs SET ${sqlParams.sql.join(', ')} WHERE id = ?
    `;
  const [result] = await pool.query(jobUpdateSQL, sqlParams.bindings);

  return result.affectedRows;
}

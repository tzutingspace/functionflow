import { pool } from '../utils/db.js';

async function getWorkflowById(id) {
  const [rows] = await pool.query(`SELECT * FROM workflows WHERE id = ?`, [id]);
  return rows[0];
}

async function insertWorkflow(workflowInfo, jobsInfo) {
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    const [result] = await conn.query(`INSERT INTO workflows SET ?`, [workflowInfo]);
    const workflowId = result.insertId;
    let depends_job_id;
    for (let i = 1; i <= workflowInfo.job_number; i++) {
      console.log(depends_job_id, jobsInfo[i]);
      const [result] = await conn.query(
        `INSERT INTO jobs(workflow_id, job_name, function_id, job_priority, depends_job_id, config) 
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          workflowId,
          jobsInfo[i].job_name,
          jobsInfo[i].function_id,
          i,
          depends_job_id,
          jobsInfo[i].config,
        ]
      );
      depends_job_id = result.insertId;
    }
    await conn.query('COMMIT');
    return depends_job_id;
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error(error);
  } finally {
    await conn.release();
  }
}

export { getWorkflowById, insertWorkflow };

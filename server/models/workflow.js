import pool from '../utils/db.js';

async function getWorkflowById(id) {
  const [rows] = await pool.query(`SELECT * FROM workflows WHERE id = ?`, [id]);
  return rows[0];
}

// 初始化wf
async function initWorkflow(userId) {
  const [result] = await pool.query(
    `INSERT INTO workflows(user_id) VALUES (?)`,
    [userId]
  );
  const workflowId = result.insertId;
  return workflowId;
}

// update wf
async function updateWorkflow(workflowId, necessaryInfo = {}) {
  const condition = { sql: '', binding: [] };
  const sqlTemp = [];

  condition.binding = Object.entries(necessaryInfo).map(([key, value]) => {
    sqlTemp.push(`${key} = ?`);
    return value;
  });
  condition.sql = sqlTemp.join(', ');
  condition.binding.push(workflowId);

  const workflowUpdatw = `UPDATE workflows SET ${condition.sql} WHERE id = ?`;
  const [result] = await pool.query(workflowUpdatw, condition.binding);
  console.log(`變更workflow Id: ${workflowId}結果`, result.info);
  // FIXME: return 結果要有一致性
  return result;
}

// 完整建立(wf and job)
async function insertWorkflow(workflowInfo, jobsInfo) {
  let dependsJobId;
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    const [result] = await conn.query(`INSERT INTO workflows SET ?`, [
      workflowInfo,
    ]);
    const workflowId = result.insertId;
    for (let i = 1; i <= workflowInfo.job_number; i++) {
      console.log(dependsJobId, jobsInfo[i]);
      // 需要序列工作, 並取得ID
      // eslint-disable-next-line no-await-in-loop
      const [jobResult] = await conn.query(
        `INSERT INTO jobs(workflow_id, job_name, function_id, job_priority, depends_job_id, config) 
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          workflowId,
          jobsInfo[i].job_name,
          jobsInfo[i].function_id,
          i,
          dependsJobId,
          JSON.stringify(jobsInfo[i].config),
        ]
      );
      dependsJobId = jobResult.insertId;
    }
    await conn.query('COMMIT');
  } catch (error) {
    await conn.query('ROLLBACK');
    console.error(error);
  } finally {
    await conn.release();
  }
  return dependsJobId;
}

export { getWorkflowById, initWorkflow, insertWorkflow, updateWorkflow };

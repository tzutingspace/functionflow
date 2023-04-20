import pool from '../utils/db.js';

// 取得 workflow
export async function getWorkflowById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      name,
      trigger_type,
      next_execute_time,
      schedule_interval,
      trigger_interval_seconds
    FROM 
      workflows 
    WHERE
      id = ?`,
    [id]
  );
  return rows[0];
}

// 取得 workflows by userId
export async function getWorkflowByUser(id) {
  const [rows] = await pool.query(
    `SELECT * FROM workflows WHERE user_id = ? ORDER by created_at DESC`,
    [id]
  );
  return rows;
}

// 初始化 workflow
export async function initWorkflow(userId) {
  const [result] = await pool.query(
    `INSERT INTO workflows(user_id) VALUES (?)`,
    [userId]
  );
  const workflowId = result.insertId;
  return workflowId;
}

// update workflow
export async function updateWorkflow(
  workflowId,
  necessaryInfo = {},
  conn = pool
) {
  const condition = { sql: '', binding: [] };
  const sqlTemp = [];

  // 來源空值不更新
  condition.binding = Object.entries(necessaryInfo).reduce(
    (acc, [key, value]) => {
      if (value) {
        sqlTemp.push(`${key} = ?`);
        acc.push(value);
      }
      return acc;
    },
    []
  );

  condition.sql = sqlTemp.join(', ');
  condition.binding.push(workflowId);

  const workflowUpdate = `UPDATE workflows SET ${condition.sql} WHERE id = ?`;
  const [result] = await conn.query(workflowUpdate, condition.binding);
  console.log(`變更workflow Id= ${workflowId} 結果: `, result.info);
  // FIXME: return 結果要有一致性
  return result;
}

// create Job
export async function createJob(workflowId, necessaryInfo = {}) {
  const [result] = await pool.query(
    `INSERT INTO jobs(workflow_id, name, function_id, sequence, customer_input) 
      VALUES (?, ?, ?, ?, ?, ?)`,
    [
      workflowId,
      necessaryInfo.name,
      necessaryInfo.function_id,
      necessaryInfo.sequence,
      necessaryInfo.customer_input,
    ]
  );
  console.log(`新增Job 成功 ID 為`, result.insertId);
  return result.insertId;
}

// update Job
export async function updateJob(jobId, necessaryInfo = {}) {
  console.log(necessaryInfo);

  const condition = { sql: '', binding: [] };
  const sqlTemp = [];

  // 來源空值不更新
  condition.binding = Object.entries(necessaryInfo).reduce(
    (acc, [key, value]) => {
      if (value) {
        sqlTemp.push(`${key} = ?`);
        acc.push(value);
      }
      return acc;
    },
    []
  );
  condition.sql = sqlTemp.join(', ');
  condition.binding.push(jobId);

  const jobUpdate = `UPDATE jobs SET ${condition.sql} WHERE id = ?`;
  const [result] = await pool.query(jobUpdate, condition.binding);
  console.log(`變更Job Id: ${jobId}結果`, result.info);
  // FIXME: return 結果要有一致性
  return result;
}

// 完整建立(wf and job)
export async function deployWorkflow(workflowId, necessaryInfo, jobsInfo) {
  let dependsJobId;
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    // Update workflow 狀態
    await updateWorkflow(workflowId, necessaryInfo, conn);
    // 刪除所有對應Job
    const [deleteId] = await conn.query(
      'SELECT id FROM jobs WHERE workflow_id = ? ORDER BY id DESC',
      [workflowId]
    );
    // 因為有id FK, 需要一個一個刪
    deleteId.forEach(async ({ id }) => {
      await conn.query('DELETE FROM jobs WHERE id = ?', [id]);
    });

    // 重新建立job
    for (let i = 1; i <= necessaryInfo.job_number; i++) {
      // 需要序列工作, 來取得下一個工作對應的id
      // eslint-disable-next-line no-await-in-loop
      const [jobResult] = await conn.query(
        `INSERT INTO jobs(workflow_id, name, function_id, sequence, depends_job_id, customer_input) 
          VALUES (?, ?, ?, ?, ?, ?)`,
        [
          workflowId,
          jobsInfo[i].job_name,
          jobsInfo[i].function_id,
          jobsInfo[i].sequence,
          dependsJobId,
          JSON.stringify(jobsInfo[i].customer_input),
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
  // FIXME: return 結果要有一致性
  return workflowId;
}

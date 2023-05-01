import pool from '../utils/db.js';

// 取得 workflowById
export async function getWorkflowById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      id,
      name,
      start_time,
      trigger_type,
      next_execute_time,
      schedule_interval,
      trigger_interval_seconds,
      job_qty
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
    `SELECT * FROM workflows WHERE user_id = ? AND (status='draft' OR status='active' OR status='inactive') ORDER by created_at DESC`,
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
      VALUES (?, ?, ?, ?, ?)`,
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
  // console.log(necessaryInfo);

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
    for (let i = 1; i <= necessaryInfo.job_qty; i++) {
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
    console.error('Deploy 出現錯誤', error);
  } finally {
    await conn.release();
  }
  // FIXME: return 結果要有一致性
  return workflowId;
}

// 刪除 workflow and job
export async function deleteWorkflows(workflowIds) {
  console.log('workflows Id', workflowIds);

  const conn = await pool.getConnection();

  // FIXME: 是否要改成for loop?
  workflowIds.map(async (workflowId) => {
    try {
      console.log('workflowId', workflowId);
      await conn.query('START TRANSACTION');
      // 刪除所有對應Job
      const [jobIds] = await conn.query(
        'SELECT id FROM jobs WHERE workflow_id = ? ORDER BY id DESC',
        [workflowId]
      );
      // 因為有id FK, 需要一個一個刪

      console.log('jobIds', jobIds);

      jobIds.map(async ({ id }) => {
        console.log('jobId', id);
        await conn.query('DELETE FROM jobs WHERE id = ?', [id]);
      });

      // 刪除workflow
      // FIXME: 是否完全刪除
      await conn.query('UPDATE workflows SET status="delete"  WHERE id = ?', [
        workflowId,
      ]);
      await conn.query('COMMIT');
    } catch (error) {
      await conn.query('ROLLBACK');
      console.log('delete workflow Error', error);
    } finally {
      await conn.release();
    }
  });

  return '開發中';
}

// 取得 workflow and Jobs By WorkflowId
export async function getWorkflowAndJobById(id) {
  const [rows] = await pool.query(
    `
    SELECT 
      wf.id as workflow_id,
      wf.name as workflow_name,
      wf.job_qty,
      wf.start_time,
      wf.status,
      wf.trigger_type,
      wf.schedule_interval,
      wf.trigger_interval_seconds,
      wf.trigger_api_route,
      jobs.id as job_id,
      jobs.name as job_name,
      jobs.function_id as function_id,
      jobs.sequence as \`sequence\`,
      jobs.customer_input
    FROM workflows as wf
        LEFT JOIN jobs ON wf.id = jobs.workflow_id
    WHERE wf.id = ?
    `,
    [id]
  );
  return rows;
}

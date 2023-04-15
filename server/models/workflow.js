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
async function updateWorkflow(workflowId, necessaryInfo = {}, conn = pool) {
  const condition = { sql: '', binding: [] };
  const sqlTemp = [];

  condition.binding = Object.entries(necessaryInfo).map(([key, value]) => {
    sqlTemp.push(`${key} = ?`);
    return value;
  });
  condition.sql = sqlTemp.join(', ');
  condition.binding.push(workflowId);

  const workflowUpdate = `UPDATE workflows SET ${condition.sql} WHERE id = ?`;
  const [result] = await conn.query(workflowUpdate, condition.binding);
  console.log(`變更workflow Id= ${workflowId} 結果: `, result.info);
  // FIXME: return 結果要有一致性
  return result;
}

// createJob
async function createJob(workflowId, necessaryInfo = {}) {
  const [result] = await pool.query(
    `INSERT INTO jobs(workflow_id, name, function_id, sequence, config_input, config_output) 
      VALUES (?, ?, ?, ?, ?, ?)`,
    [
      workflowId,
      necessaryInfo.name,
      necessaryInfo.function_id,
      necessaryInfo.sequence,
      JSON.stringify(necessaryInfo.config_input),
      // FIXME: 確認是否需要config_output; 目前與function的template一樣
      JSON.stringify('["name":"no use"]'),
    ]
  );
  console.log(`新增Job 成功 ID 為`, result.insertId);
  return result.insertId;
}

// updateJob
async function updateJob(jobId, necessaryInfo = {}) {
  console.log(necessaryInfo);

  const condition = { sql: '', binding: [] };
  const sqlTemp = [];

  condition.binding = Object.entries(necessaryInfo).map(([key, value]) => {
    sqlTemp.push(`${key} = ?`);
    if (key === 'config_input') {
      return JSON.stringify(value);
    }
    return value;
  });
  condition.sql = sqlTemp.join(', ');
  condition.binding.push(jobId);

  const jobUpdate = `UPDATE jobs SET ${condition.sql} WHERE id = ?`;
  const [result] = await pool.query(jobUpdate, condition.binding);
  console.log(`變更Job Id: ${jobId}結果`, result.info);
  // FIXME: return 結果要有一致性
  return result;
}

// 完整建立(wf and job)
async function deployWorkflow(workflowId, necessaryInfo, jobsInfo) {
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
        `INSERT INTO jobs(workflow_id, name, function_id, sequence, depends_job_id, config_input, config_output) 
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          workflowId,
          jobsInfo[i].job_name,
          jobsInfo[i].function_id,
          jobsInfo[i].sequence,
          dependsJobId,
          JSON.stringify(jobsInfo[i].config_input),
          // FIXME: 確認是否需要config_output; 目前與function的template一樣
          JSON.stringify('["name":"no use"]'),
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

export {
  getWorkflowById,
  initWorkflow,
  updateWorkflow,
  createJob,
  updateJob,
  deployWorkflow,
};

// async function deployWorkflow(workflowInfo, jobsInfo) {
//   let dependsJobId;
//   const conn = await pool.getConnection();
//   try {
//     await conn.query('START TRANSACTION');
//     const [result] = await conn.query(`INSERT INTO workflows SET ?`, [
//       workflowInfo,
//     ]);
//     const workflowId = result.insertId;
//     for (let i = 1; i <= workflowInfo.job_number; i++) {
//       console.log(dependsJobId, jobsInfo[i]);
//       // 需要序列工作, 並取得ID
//       // eslint-disable-next-line no-await-in-loop
//       const [jobResult] = await conn.query(
//         `INSERT INTO jobs(workflow_id, job_name, function_id, job_priority, depends_job_id, config)
//           VALUES (?, ?, ?, ?, ?, ?)`,
//         [
//           workflowId,
//           jobsInfo[i].job_name,
//           jobsInfo[i].function_id,
//           i,
//           dependsJobId,
//           JSON.stringify(jobsInfo[i].config),
//         ]
//       );
//       dependsJobId = jobResult.insertId;
//     }
//     await conn.query('COMMIT');
//   } catch (error) {
//     await conn.query('ROLLBACK');
//     console.error(error);
//   } finally {
//     await conn.release();
//   }
//   return dependsJobId;
// }

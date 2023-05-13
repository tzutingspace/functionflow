import pool from '../utils/db.js';

// get workflow By id and userId
export async function getWorkflowById(workflowId, userId) {
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
      id = ? AND user_id = ?
    `,
    [workflowId, userId]
  );
  return rows[0];
}

// get workflows by userId
export async function getWorkflowsByUser(userId) {
  const [rows] = await pool.query(
    `
    SELECT
        id,
        name,
        updated_at,
        status,
        start_time,
        job_qty
    FROM workflows
    WHERE
        user_id = ?
        AND (
            status IN ('draft', 'active', 'inactive')
        )
    ORDER by id DESC
    `,
    [userId]
  );
  return rows;
}

// Init(Create) a new Workflow
export async function initWorkflow(userId) {
  const [result] = await pool.query(
    `INSERT INTO workflows(user_id) VALUES (?)`,
    [userId]
  );
  return result.insertId;
}

// update workflow
export async function updateWorkflow(
  workflowId,
  necessaryInfo = {},
  conn = pool
) {
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

  sqlParams.bindings.push(workflowId);

  const workflowUpdate = `
  UPDATE workflows SET ${sqlParams.sql.join(', ')} WHERE id = ?
  `;

  const [result] = await conn.query(workflowUpdate, sqlParams.bindings);
  console.debug(`update workflow id-${workflowId} result: `, result);
  return result.affectedRows;
}

// deploy workflow and jobs
export async function deployWorkflow(workflowId, necessaryInfo, jobsInfo) {
  let dependsJobId;
  const conn = await pool.getConnection();
  try {
    await conn.query('START TRANSACTION');
    await updateWorkflow(workflowId, necessaryInfo, conn);

    // delete all relate jobs
    const [deleteIds] = await conn.query(
      'SELECT id FROM jobs WHERE workflow_id = ? ORDER BY id DESC',
      [workflowId]
    );
    deleteIds.forEach(({ id }) => {
      conn.query('DELETE FROM jobs WHERE id = ?', [id]);
    });

    // re-ceate all jobs (serial)
    for (let i = 1; i <= necessaryInfo.job_qty; i++) {
      console.log('weqwewqewq', i);
      // need to sequence the jobs to obtain the next job ID
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
  return workflowId;
}

// delete workflow
export async function deleteWorkflow(workflowId, userId) {
  console.debug('@delete workflow model,  workflow Id:', workflowId);
  const [result] = await pool.query(
    `UPDATE workflows SET status="delete" WHERE id = ? AND user_id = ?`,
    [workflowId, userId]
  );
  return result.changedRows;
}

// delete jobs by workflow Id
export async function deletejobs(workflowId) {
  console.debug('@delete jobs model, workflow Id', workflowId);
  const [result] = await pool.query(`DELETE FROM jobs WHERE workflow_id = ?`, [
    workflowId,
  ]);
  return result.affectedRows;
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

import pool from '../utils/db.js';

// create instances (wf and job)
// TODO: 與lambda 介面要一樣
export async function createInstances(workflowInfo) {
  // 1.create workflows_instances
  const conn = await pool.getConnection();
  const readyToQueueObj = { workflow: workflowInfo };

  try {
    await conn.query('START TRANSACTION');

    const [wfInstanceResult] = await conn.query(
      `
      INSERT INTO
          workflows_instances (
              workflow_id,
              status,
              trigger_type,
              execution_time,
              manual_trigger,
              end_time
          )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        workflowInfo.id,
        workflowInfo.status,
        workflowInfo.trigger_type,
        workflowInfo.execution_time,
        workflowInfo.manual_trigger,
        workflowInfo.end_time,
      ]
    );
    console.debug('create wf-instance ID:', wfInstanceResult.insertId);
    readyToQueueObj.workflow.wf_instance_id = wfInstanceResult.insertId;

    // get this workflow all jobs
    const [jobsDetail] = await conn.query(
      `
      SELECT 
        jobs.id, 
        jobs.name, 
        jobs.sequence, 
        jobs.depends_job_id,
        jobs.customer_input,
        \`functions\`.template_output as config_output,
        \`functions\`.name as function_name
      FROM \`jobs\` 
        INNER JOIN \`functions\` ON jobs.function_id = \`functions\`.id 
      WHERE workflow_id = ? 
      ORDER BY sequence
      `,
      [workflowInfo.id]
    );

    // ready create job instances
    readyToQueueObj.steps = {};
    readyToQueueObj.ready_execute_job = [];
    let prevJobInstanceId = null;

    for (const job of jobsDetail) {
      job.status = 'waiting';
      job.depends_job_instance_id = prevJobInstanceId;
      // // 雖然沒資料, 但為了後續ㄧ致性
      // job.start_time = null;
      // job.end_time = null;
      // job.result_output = null;
      job.customer_input = JSON.stringify(job.customer_input); // FIXME: 和lambda不同, python 取出為string?
      job.config_output = JSON.stringify(job.config_output);

      // put first job to step_now
      if (job.sequence === 1) {
        readyToQueueObj.step_now = job.name;
      }

      // need serial (prevJobInstanceId)
      // eslint-disable-next-line no-await-in-loop
      const [jobInstanceResult] = await conn.query(
        `
        INSERT INTO
          jobs_instances (
            workflow_instance_id,
            name,
            status,
            sequence,
            customer_input,
            config_output,
            depends_job_instance_id,
            function_name
          )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          wfInstanceResult.insertId,
          job.name,
          job.status,
          job.sequence,
          job.customer_input,
          job.config_output,
          job.depends_job_instance_id,
          job.function_name,
        ]
      );
      job.id = jobInstanceResult.insertId;
      prevJobInstanceId = jobInstanceResult.insertId;

      // put data to readyToQueueObj
      readyToQueueObj.ready_execute_job.push(job.name);
      readyToQueueObj.steps[job.name] = job;
    }
    await conn.query('COMMIT');
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log('Create instances encountered an error', error);
    return false;
  } finally {
    await conn.release();
  }
  return readyToQueueObj;
}

export async function searchInstancesHistory(workflowId) {
  const [rows] = await pool.query(
    `
    SELECT
      wf.status as wf_status,
      wf.id as wf_id,
      wf.job_qty as wf_jobs_qty,
      wfi.status as wfi_status,
      wfi.trigger_type,
      wfi.manual_trigger,
      wfi.id as wfi_id,
      wfi.execution_time as execution_time,
      jobi.id as job_id,
      jobi.sequence,
      jobi.name as job_name,
      jobi.status as job_status,
      jobi.customer_input as customer_input,
      jobi.result_output
    FROM workflows as wf
      LEFT JOIN workflows_instances as wfi ON wf.id = wfi.workflow_id
      LEFT JOIN jobs_instances as jobi ON wfi.id = jobi.workflow_instance_id
    WHERE 
      wf.id = ?
    ORDER BY
      wfi.execution_time DESC, jobi.id
    `,
    [workflowId]
  );

  return rows;
}

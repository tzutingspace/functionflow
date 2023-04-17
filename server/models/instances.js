import pool from '../utils/db.js';

// create instances
export async function createInstances(workflowInfo) {
  // 建立 workflows_instances
  const conn = await pool.getConnection();

  const outputObj = {};

  try {
    await conn.query('START TRANSACTION');

    // 建立wf instance
    const [wfInstanceResult] = await conn.query(
      `INSERT INTO workflows_instances
      (workflows_id, \`status\`, trigger_type, execution_time, external_trigger)
      VALUES(?, ?, ?, ?, ?)`,
      [
        workflowInfo.id,
        workflowInfo.status,
        workflowInfo.trigger_type,
        workflowInfo.execution_time,
        workflowInfo.external_trigger,
      ]
    );
    const wfInstanceId = wfInstanceResult.insertId;
    console.log('建立的wf instance ID:', wfInstanceId);
    outputObj.workflow = workflowInfo;
    outputObj.workflow.wf_instance_id = wfInstanceId;

    // 取得該筆 workflow 所有的jobs
    const [jobsResult] = await conn.query(
      `SELECT jobs.id, jobs.name, jobs.sequence, jobs.depends_job_id,
      jobs.config_input, jobs.config_output, \`functions\`.name as function_name,
      \`functions\`.id as function_id 
      FROM \`jobs\` INNER JOIN \`functions\` ON jobs.function_id = \`functions\`.id 
      WHERE workflow_id = ? ORDER BY sequence`,
      [workflowInfo.id]
    );

    console.log('所有jobs', jobsResult);

    // 建立job instances
    outputObj.steps = {};
    outputObj.ready_execute_job = [];
    let jobInstanceId = null;

    // 建立 jobs_instances
    // FIXME:
    // eslint-disable-next-line no-restricted-syntax
    for (const job of jobsResult) {
      console.log('建立job instances', job);
      job.status = 'waiting';
      job.depends_job_instance_id = jobInstanceId;
      job.start_time = null;
      job.end_time = null;
      job.result_output = null;
      outputObj.ready_execute_job.push(job.name);
      if (job.sequence === 1) {
        outputObj.step_now = job.name;
      }
      // 有 dependes 的需求
      // FIXME:
      // eslint-disable-next-line no-await-in-loop
      const [jobinstanceResult] = await conn.query(
        `INSERT INTO jobs_instances (workflow_instance_id, name, status, 
          sequence, config_input, config_output, depends_job_instance_id) 
          VALUES (?, ?, ?,  ?, ?, ?, ?)`,
        [
          wfInstanceId,
          job.name,
          job.status,
          job.sequence,
          JSON.stringify(job.config_input),
          JSON.stringify(job.config_output),
          job.depends_job_instance_id,
        ]
      );
      jobInstanceId = jobinstanceResult.insertId;
      job.id = jobInstanceId;
      job.config_input = JSON.stringify(job.config_input);
      job.config_output = JSON.stringify(job.config_output);
      const jobName = job.name;
      outputObj.steps[jobName] = job;
    }

    await conn.query('COMMIT');
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log(error);
  } finally {
    await conn.release();
  }

  return outputObj;
}

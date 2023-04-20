import pool from '../utils/db.js';

// create instances (wf and job)
// TODO: 與lambda 介面要一樣
export async function createInstances(workflowInfo) {
  // 建立 workflows_instances
  const conn = await pool.getConnection();
  const readyToQueueObj = {};
  readyToQueueObj.workflow = workflowInfo;

  try {
    await conn.query('START TRANSACTION'); // FIXME: 有必要嗎？

    // 建立 wf instance
    const [wfInstanceResult] = await conn.query(
      `INSERT INTO workflows_instances
        (workflow_id, \`status\`, trigger_type, execution_time, manual_trigger, end_time)
      VALUES(?, ?, ?, ?, ?, ?)`,
      [
        workflowInfo.id,
        workflowInfo.status,
        workflowInfo.trigger_type,
        workflowInfo.execution_time,
        workflowInfo.manual_trigger,
        workflowInfo.end_time,
      ]
    );
    const wfInstanceId = wfInstanceResult.insertId;
    console.log('建立的wf instance ID:', wfInstanceId);
    readyToQueueObj.workflow.wf_instance_id = wfInstanceId;

    // 取得該筆 workflow 所有的jobs
    const [jobsDetail] = await conn.query(
      `SELECT 
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
      ORDER BY sequence`,
      [workflowInfo.id]
    );
    console.log('所有jobs', jobsDetail);
    // 建立job instances
    readyToQueueObj.steps = {};
    readyToQueueObj.ready_execute_job = [];
    let prevJobInstanceId = null;

    // 建立 jobs_instances
    // FIXME:
    // eslint-disable-next-line no-restricted-syntax
    for (const job of jobsDetail) {
      console.log('建立job instances', job);
      job.status = 'waiting';
      job.depends_job_instance_id = prevJobInstanceId;
      // 雖然沒資料, 但為了後續ㄧ致性
      job.start_time = null;
      job.end_time = null;
      job.result_output = null;
      job.customer_input = JSON.stringify(job.customer_input); // FIXME: 和lambda不同, python 取出為string?
      job.config_output = JSON.stringify(job.config_output);

      // 第一個JOB
      if (job.sequence === 1) {
        readyToQueueObj.step_now = job.name;
      }

      // 建立job instance
      // 有依序的需求
      // eslint-disable-next-line no-await-in-loop
      const [jobinstanceResult] = await conn.query(
        `INSERT INTO 
          jobs_instances 
            (workflow_instance_id, name, status, sequence, customer_input,
            config_output, depends_job_instance_id, function_name) 
          VALUES (?, ?, ?,  ?, ?,
             ?, ?, ?)`,
        [
          wfInstanceId,
          job.name,
          job.status,
          job.sequence,
          job.customer_input,
          job.config_output,
          job.depends_job_instance_id,
          job.function_name,
        ]
      );
      job.id = jobinstanceResult.insertId;
      prevJobInstanceId = jobinstanceResult.insertId;

      // 將資料寫到readyToQueueObj
      const jobName = job.name;
      readyToQueueObj.ready_execute_job.push(jobName);
      readyToQueueObj.steps[jobName] = job;
    }
    await conn.query('COMMIT');
  } catch (error) {
    await conn.query('ROLLBACK');
    console.log('建立instances 出現錯誤', error);
  } finally {
    await conn.release();
  }

  return readyToQueueObj;
}

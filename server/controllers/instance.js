import * as DBInstances from '../models/instance.js';

export const searchInstancesHistory = async (req, res) => {
  console.log('@searchInstancesHistory controller');
  const { id } = req.params;

  const result = await DBInstances.searchInstancesHistory(id);

  const reduceInstancesObj = result.reduce((acc, curr) => {
    if (!acc[curr.wfi_id]) {
      acc[curr.wfi_id] = {
        workflowInfo: {
          workflowStatus: curr.wf_status,
          workflowId: curr.wf_id,
          workflowJobsQty: curr.wf_jobs_qty,
          status: curr.wfi_status,
          trigger_type: curr.trigger_type,
          manual_trigger: curr.manual_trigger,
          workflowInstanceId: curr.wfi_id,
          execution_time: curr.execution_time,
        },
        jobsInfo: [],
      };
    }

    const jobInfo = {
      jobId: curr.job_id,
      sequence: curr.sequence,
      jobname: curr.job_name,
      job_status: curr.job_status,
      customer_input: curr.customer_input,
      result_output: curr.result_output,
    };

    acc[curr.wfi_id].jobsInfo.push(jobInfo);
    return acc;
  }, {});

  const outputInstancesInfo = Object.values(reduceInstancesObj)
    .map((info) => info)
    .sort(
      (a, b) =>
        b.workflowInfo.workflowInstanceId - a.workflowInfo.workflowInstanceId
    );

  return res.json({ data: outputInstancesInfo });
};

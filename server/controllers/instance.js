import * as DBInstances from '../models/instance.js';

export const searchInstancesHistory = async (req, res) => {
  const { workflowId } = req.params;

  const result = await DBInstances.searchInstancesHistory(workflowId);

  const tempObj = result.reduce((acc, curr) => {
    if (!acc[curr.wfi_id]) {
      acc[curr.wfi_id] = {
        workflowInfo: {
          workflowId: curr.wf_id,
          status: curr.wfi_status,
          trigger_type: curr.trigger_type,
          manual_trigger: curr.manual_trigger,
          workflowInstanceId: curr.wfi_id,
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

  const output = Object.values(tempObj).map((info) => info);

  return res.json({ data: output });
};

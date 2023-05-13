import * as DBWorkflow from '../models/workflow.js';
import { validInteger } from '../utils/utli.js';

import BadRequestError from '../utils/errors/badRequestError.js';

// CREATE JOB
export const createJob = async (req, res, next) => {
  console.debug('@controller createJob');
  console.debug('request Body', req.body);
  const { workflowInfo, jobsInfo } = req.body;
  const insertJobSeq = jobsInfo.sequence;
  const workflowId = workflowInfo.id;

  if (!validInteger(insertJobSeq)) {
    return next(new BadRequestError('Query Params Error'));
  }

  const necessaryInfo = {
    name: jobsInfo.job_name,
    function_id: jobsInfo.function_id,
    sequence: jobsInfo.sequence,
    customer_input: JSON.stringify(jobsInfo.customer_input),
  };

  const result = await DBWorkflow.createJob(workflowId, necessaryInfo);

  return res.json({ data: result });
};

// UPDATE JOB
export const updateJob = async (req, res, next) => {
  console.log('@controller updateJob');
  console.log('request Body', req.body);
  const { jobsInfo } = req.body;
  const updateJobSeq = jobsInfo.sequence;
  const jobId = req.params.id;

  if (!validInteger(jobId) || !validInteger(updateJobSeq)) {
    return next(new BadRequestError('Query Params Error'));
  }

  const necessaryInfo = {
    name: jobsInfo.job_name,
    function_id: jobsInfo.function_id,
    sequence: jobsInfo.sequence,
    customer_input: JSON.stringify(jobsInfo.customer_input),
  };

  const result = await DBWorkflow.updateJob(jobId, necessaryInfo);
  return res.json({ data: result });
};

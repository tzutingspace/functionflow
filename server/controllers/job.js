import * as DBJob from '../models/job.js';
import { validInteger } from '../utils/utli.js';

import BadRequestError from '../utils/errors/badRequestError.js';

// CREATE JOB
export const createJob = async (req, res) => {
  console.debug('@controller createJob', req.body);
  const { jobsInfo } = req.body;
  const workflowId = req.workflowDatabaseResult.id;

  const necessaryInfo = {
    name: jobsInfo.job_name,
    function_id: jobsInfo.function_id,
    sequence: jobsInfo.sequence,
    customer_input: JSON.stringify(jobsInfo.customer_input),
  };

  const result = await DBJob.createJob(workflowId, necessaryInfo);

  return res.json({ data: result });
};

// UPDATE JOB
export const updateJob = async (req, res, next) => {
  console.log('@controller updateJob', req.body);
  const { jobsInfo } = req.body;
  const jobId = req.params.id;

  if (!validInteger(jobId)) {
    return next(new BadRequestError('Query Params Error'));
  }

  const necessaryInfo = {
    name: jobsInfo.job_name,
    function_id: jobsInfo.function_id,
    sequence: jobsInfo.sequence,
    customer_input: JSON.stringify(jobsInfo.customer_input),
  };

  const result = await DBJob.updateJob(jobId, necessaryInfo);

  return res.json({ data: result });
};

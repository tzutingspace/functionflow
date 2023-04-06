import * as Workflow from '../models/workflow.js';
import { vaildInterger, getNowTime, calculateTime } from '../utils/utli.js';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/customError.js';

export const getWorkflow = async (req, res, next) => {
  console.log('@controller getWorkflow');
  const { id } = req.params;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await Workflow.getWorkflowById(id);
  return res.json({ msg: workflow });
};

export const createWorkflow = async (req, res, next) => {
  console.log('@controller createWorkflow');
  console.log(req.body);
  const workflowInfo = req.body.workflowInfo;
  workflowInfo['next_execute_time'] = calculateTime(
    workflowInfo['start_time'],
    workflowInfo['trigger_interval_minutes']
  );

  const jobsInfo = req.body.jobsInfo;

  const result = await Workflow.insertWorkflow(workflowInfo, jobsInfo);
  return res.json({ msg: result });
};

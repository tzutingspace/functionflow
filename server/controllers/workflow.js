import { StatusCodes } from 'http-status-codes';
import * as DBWorkflow from '../models/workflow.js';
import { vaildInterger, calculateTime } from '../utils/utli.js';
import CustomError from '../utils/customError.js';

// Get old Workflow
export const getWorkflow = async (req, res, next) => {
  console.log('@controller getWorkflow');
  const { id } = req.params;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await DBWorkflow.getWorkflowById(id);
  return res.json({ data: workflow });
};

// Init a new Workflow
export const initWorkflow = async (req, res) => {
  console.log('@controller initWorkflow');
  // FIXME: 身份驗證後需修改
  const userId = 1; // req.user
  const workflowId = await DBWorkflow.initWorkflow(userId);
  return res.json({ data: workflowId });
};

// Update a Workflow
export const updateWorkflow = async (req, res, next) => {
  console.log('@controller updateWorkflow');
  console.log('request Body', req.body);
  const { workflowInfo } = req.body;
  const workflowId = req.params.id;

  // 驗證id是否為數字
  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // TODO:驗證此user是否有此id的修改權限
  // TODO:過濾workflow可修改資訊
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status,
    start_time: workflowInfo.start_time,
    next_execute_time: workflowInfo.next_execute_time,
    trigger_type: workflowInfo.trigger_type,
    trigger_interval_seconds: workflowInfo.trigger_interval_seconds,
    job_number: workflowInfo.job_number,
  };
  const result = await DBWorkflow.updateWorkflow(workflowId, necessaryInfo);
  return res.json({ data: result });
};

// TODO: DEPLOY ALL WORKFLOW
export const deployWorkflow = async (req, res) => {
  const { workflowInfo } = req.body;

  workflowInfo.next_execute_time = calculateTime(
    workflowInfo.start_time,
    workflowInfo.trigger_interval_minutes
  );

  const { jobsInfo } = req.body;

  const result = await DBWorkflow.insertWorkflow(workflowInfo, jobsInfo);
  console.log(result);
  return res.json({ data: '開發中' });
};

// CREATE JOB
export const createJob = async (req, res, next) => {
  console.log('@controller createJob');
  const { workflowInfo, jobsInfo } = req.body;
  const { insertJobSeq } = req.body;
  const workflowId = workflowInfo.id;

  if (!vaildInterger(insertJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  const necessaryInfo = {
    name: jobsInfo[insertJobSeq].job_name,
    function_id: jobsInfo[insertJobSeq].function_id,
    sequence: jobsInfo[insertJobSeq].sequence,
    config_input: jobsInfo[insertJobSeq].config_input,
  };

  const result = await DBWorkflow.createJob(workflowId, necessaryInfo);

  return res.json({ data: result });
};

// UPDATE JOB
export const updateJob = async (req, res, next) => {
  console.log('@controller updateJob');
  console.log('request Body', req.body);
  const { jobsInfo } = req.body;
  const { insertJobSeq } = req.body;
  const jobId = req.params.id;

  if (!vaildInterger(insertJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 驗證id是否為數字
  if (!vaildInterger(jobId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // TODO:驗證此user是否有此id的修改權限
  // TODO:過濾Job可修改資訊
  const necessaryInfo = {
    name: jobsInfo[insertJobSeq].job_name,
    function_id: jobsInfo[insertJobSeq].function_id,
    sequence: jobsInfo[insertJobSeq].sequence,
    config_input: jobsInfo[insertJobSeq].config_input,
  };

  // 更新資料
  const result = await DBWorkflow.updateJob(jobId, necessaryInfo);
  return res.json({ data: result });
};

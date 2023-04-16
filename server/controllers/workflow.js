import { StatusCodes } from 'http-status-codes';
import * as DBWorkflow from '../models/workflow.js';
import * as DBTool from '../models/tool.js';
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
  // 過濾workflow可修改資訊
  const id = workflowInfo.function_id;
  const toolInfo = await DBTool.getTools({ id });

  // 沒有這個funciton
  if (!toolInfo[0]) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 這個funciton 不是trigger
  if (toolInfo[0].type !== 'trigger') {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // Schedule 判斷 寫入內容
  // TODO: 如果是API???
  let triggerIntervalSeconds;
  let triggerType = 'scheduled';
  if (toolInfo[0].trigger_type === 'daily') {
    triggerIntervalSeconds = 86400;
  } else if (toolInfo[0].trigger_type === 'weekly') {
    triggerIntervalSeconds = 86400 * 7;
  } else if (toolInfo[0].trigger_type === 'monthly') {
    triggerIntervalSeconds = 86400 * 30;
  } else {
    triggerIntervalSeconds = -1;
    triggerType = 'API';
  }
  const nextExecuteTime = calculateTime(
    workflowInfo.start_time,
    triggerIntervalSeconds
  );

  // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status,
    start_time: workflowInfo.start_time,
    next_execute_time: nextExecuteTime,
    trigger_type: triggerType,
    trigger_interval_seconds: triggerIntervalSeconds,
    trigger_api_route: workflowInfo.trigger_api_route,
    job_number: workflowInfo.job_number,
  };
  const result = await DBWorkflow.updateWorkflow(workflowId, necessaryInfo);
  return res.json({ data: result });
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
  // FIXME: 如果create 的資料會影響下面的sequence??

  const necessaryInfo = {
    name: jobsInfo[insertJobSeq].job_name,
    function_id: jobsInfo[insertJobSeq].function_id,
    sequence: jobsInfo[insertJobSeq].sequence,
    config_input: JSON.stringify(jobsInfo[insertJobSeq].config_input),
  };

  const result = await DBWorkflow.createJob(workflowId, necessaryInfo);

  return res.json({ data: result });
};

// UPDATE JOB
export const updateJob = async (req, res, next) => {
  console.log('@controller updateJob');
  console.log('request Body', req.body);
  const { jobsInfo } = req.body;
  const { updateJobSeq } = req.body;
  const jobId = req.params.id;

  if (!vaildInterger(updateJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 驗證id是否為數字
  if (!vaildInterger(jobId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // TODO:驗證此user是否有此id的修改權限
  // TODO:過濾Job可修改資訊
  const necessaryInfo = {
    name: jobsInfo[updateJobSeq].job_name,
    function_id: jobsInfo[updateJobSeq].function_id,
    sequence: jobsInfo[updateJobSeq].sequence,
    config_input: JSON.stringify(jobsInfo[updateJobSeq].config_input),
  };

  // 更新資料
  const result = await DBWorkflow.updateJob(jobId, necessaryInfo);
  return res.json({ data: result });
};

// DEPLOY ALL WORKFLOW
export const deployWorkflow = async (req, res, next) => {
  const { workflowInfo, jobsInfo } = req.body;
  const workflowId = req.params.id;

  // 驗證id是否為數字
  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  const id = workflowInfo.function_id;
  const toolInfo = await DBTool.getTools({ id });

  // 沒有這個funciton
  if (!toolInfo[0]) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 這個funciton 不是trigger
  if (toolInfo[0].type !== 'trigger') {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  let triggerIntervalSeconds;
  let triggerType = 'scheduled';
  if (toolInfo[0].trigger_type === 'daily') {
    triggerIntervalSeconds = 86400;
  } else if (toolInfo[0].trigger_type === 'weekly') {
    triggerIntervalSeconds = 86400 * 7;
  } else if (toolInfo[0].trigger_type === 'monthly') {
    triggerIntervalSeconds = 86400 * 30;
  } else {
    triggerIntervalSeconds = -1;
    triggerType = 'API';
  }
  const nextExecuteTime = calculateTime(
    workflowInfo.start_time,
    triggerIntervalSeconds
  );

  // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status || 'active',
    start_time: workflowInfo.start_time,
    next_execute_time: nextExecuteTime,
    trigger_type: triggerType,
    trigger_interval_seconds: triggerIntervalSeconds,
    trigger_api_route: workflowInfo.trigger_api_route,
    job_number: workflowInfo.job_number,
  };

  const result = await DBWorkflow.deployWorkflow(
    workflowId,
    necessaryInfo,
    jobsInfo
  );
  return res.json({ data: result });
};

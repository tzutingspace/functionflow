import { StatusCodes } from 'http-status-codes';
import date from 'date-and-time';
import * as DBWorkflow from '../models/workflow.js';
import * as DBTool from '../models/tool.js';
import { vaildInterger } from '../utils/utli.js';
import CustomError from '../utils/customError.js';

import { triggerFunctionMap } from '../config/triggerFunction.js';

// Get old Workflow (Only workflow)
export const getWorkflow = async (req, res, next) => {
  console.log('@controller getWorkflow');
  const { id } = req.params;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await DBWorkflow.getWorkflowById(id);
  return res.json({ data: workflow });
};

export const getWorkflowByUser = async (req, res, next) => {
  console.log('@controller getWorkflowByUser');
  const { id } = req.user;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await DBWorkflow.getWorkflowByUser(id);
  return res.json({ data: workflow });
};

// Init a new Workflow
export const initWorkflow = async (req, res) => {
  console.log('@controller initWorkflow');
  // FIXME: 身份驗證後需修改
  const userId = req.user.id;
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

  // 確認此 workflow trigger function 是否正確
  const id = workflowInfo.trigger_function_id;
  const [triggerInfo] = await DBTool.getTriggers({ id });

  // 沒有這個 trigger function
  if (!triggerInfo) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  const startTime = new Date(workflowInfo.start_time);
  let triggerIntervalSeconds;
  let nextExecuteTime;
  if (triggerInfo.name === 'custom') {
    if (workflowInfo.jobsInfo.interval === 'hour') {
      triggerIntervalSeconds = workflowInfo.jobsInfo.every * 60 * 60;
      nextExecuteTime = date.addHours(
        startTime,
        parseInt(workflowInfo.jobsInfo.every, 10)
      );
    } else if (workflowInfo.jobsInfo.interval === 'minute') {
      triggerIntervalSeconds = workflowInfo.jobsInfo.every * 60;
      console.log('minute', workflowInfo.jobsInfo.every);
      nextExecuteTime = date.addMinutes(
        startTime,
        parseInt(workflowInfo.jobsInfo.every, 10)
      );
    }
  } else if (triggerInfo.name === 'daily') {
    triggerIntervalSeconds = 86400;
    nextExecuteTime = date.addDays(startTime, 1);
  } else if (triggerInfo.name === 'weekly') {
    triggerIntervalSeconds = 86400 * 7;
    nextExecuteTime = date.addDays(startTime, 7);
  } else if (triggerInfo.name === 'monthly') {
    nextExecuteTime = date.addMonths(startTime, 1);
  }

  // TODO: 如果是API???

  // // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status,
    start_time: workflowInfo.start_time,
    next_execute_time: date.format(nextExecuteTime, 'YYYY-MM-DD HH:mm:ss'),
    trigger_type: triggerInfo.type,
    trigger_interval_seconds: triggerIntervalSeconds,
    trigger_api_route: workflowInfo.trigger_api_route,
    job_qty: workflowInfo.job_qty,
    schedule_interval: triggerInfo.name,
  };
  const result = await DBWorkflow.updateWorkflow(workflowId, necessaryInfo);
  return res.json({ data: result });
};

// DELETE Workflows
export const deleteWorkflows = async (req, res) => {
  console.log('@controller deployWorkflow');
  console.log('@delete workflows', req.body);
  const { id } = req.body;
  const [result] = await DBWorkflow.deleteWorkflows(id);
  return res.json({ data: result });
};

// CREATE JOB
export const createJob = async (req, res, next) => {
  console.log('@controller createJob');
  console.log('request Body', req.body);
  const { workflowInfo, jobsInfo } = req.body;
  const insertJobSeq = jobsInfo.sequence;
  const workflowId = workflowInfo.id;

  if (!vaildInterger(insertJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // FIXME: 如果create 的資料會影響下面的sequence??

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
    name: jobsInfo.job_name,
    function_id: jobsInfo.function_id,
    sequence: jobsInfo.sequence,
    customer_input: JSON.stringify(jobsInfo.customer_input),
  };

  // 更新資料
  const result = await DBWorkflow.updateJob(jobId, necessaryInfo);
  return res.json({ data: result });
};

// DEPLOY ALL WORKFLOW
export const deployWorkflow = async (req, res, next) => {
  console.log('@controller deployWorkflow');
  console.log('request Body', req.body);
  const { workflowInfo, jobsInfo } = req.body;
  const workflowId = req.params.id;

  // 驗證id是否為數字
  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 確認此 workflow trigger function 是否正確
  const id = workflowInfo.trigger_function_id;
  const [triggerInfo] = await DBTool.getTriggers({ id });

  // 沒有這個 trigger function
  if (!triggerInfo) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 處理下次執行時間
  const startTime = new Date(workflowInfo.start_time);
  let triggerIntervalSeconds;
  let nextExecuteTime;
  if (triggerInfo.name === 'custom') {
    if (workflowInfo.jobsInfo.interval === 'hour') {
      console.log(workflowInfo.jobsInfo.every);
      triggerIntervalSeconds = workflowInfo.jobsInfo.every * 60 * 60;
      nextExecuteTime = date.addHours(
        startTime,
        parseInt(workflowInfo.jobsInfo.every, 10)
      );
    } else if (workflowInfo.jobsInfo.interval === 'minute') {
      triggerIntervalSeconds = workflowInfo.jobsInfo.every * 60;
      nextExecuteTime = date.addMinutes(
        startTime,
        parseInt(workflowInfo.jobsInfo.every, 10)
      );
    }
  } else if (triggerInfo.name === 'daily') {
    triggerIntervalSeconds = 86400;
    nextExecuteTime = date.addDays(startTime, 1);
  } else if (triggerInfo.name === 'weekly') {
    triggerIntervalSeconds = 86400 * 7;
    nextExecuteTime = date.addDays(startTime, 7);
  } else if (triggerInfo.name === 'monthly') {
    nextExecuteTime = date.addMonths(startTime, 1);
  }

  // TODO: 如果是API???

  // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status || 'active',
    start_time: workflowInfo.start_time,
    next_execute_time: date.format(nextExecuteTime, 'YYYY-MM-DD HH:mm:ss'),
    trigger_type: triggerInfo.type,
    trigger_interval_seconds: triggerIntervalSeconds,
    trigger_api_route: workflowInfo.trigger_api_route,
    job_qty: workflowInfo.job_qty,
    schedule_interval: triggerInfo.name,
  };

  const result = await DBWorkflow.deployWorkflow(
    workflowId,
    necessaryInfo,
    jobsInfo
  );
  return res.json({ data: result });
};

// Edit Workflow 用

export const editWorkflow = async (req, res, next) => {
  console.log('@Edit Workflow controller...');
  const { workflowId } = req.params;
  console.log(workflowId);

  // 驗證id是否為數字
  if (!vaildInterger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  const data = await DBWorkflow.getWorkflowAndJobById(workflowId);

  console.log('data', data);

  if (data.length === 0) {
    return next(new CustomError('Not Found', 404));
  }

  // 轉換custom 時間
  // FIXME: 除了custom, 其他範例要給前端嗎？
  const every = data[0].trigger_interval_seconds / 60;

  // Create the first object
  const firstObj = {
    workflow_id: data[0].workflow_id,
    workflow_name: data[0].workflow_name,
    trigger_function_id: triggerFunctionMap[data[0].schedule_interval], // trigger_funcition數量不多, 利用constant轉換
    status: data[0].status,
    settingInfo: {
      job_qty: data[0].job_qty,
      start_time: date.format(data[0].start_time, 'YYYY-MM-DD HH:mm:ss'),
      trigger_type: data[0].trigger_type,
      customer_input: {
        start_time: data[0].start_time, // daily, weekly, monthly 都只要start_time即可
        every,
        interval: 'minute', // FIXME: 先轉成minute, create 的時候沒有紀錄
      },
    },
  };

  // Create an array of job objects
  const jobObjs = data.map((job) => ({
    job_id: job.job_id,
    job_name: job.job_name,
    function_id: job.function_id,
    settingInfo: {
      sequence: job.sequence,
      customer_input: job.customer_input,
    },
  }));

  // Combine the first object and job objects into a single array
  const result = [firstObj, ...jobObjs];

  console.log(result);

  return res.json({ data: result });
};

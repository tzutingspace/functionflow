import { StatusCodes } from 'http-status-codes';
import date from 'date-and-time';
import * as DBWorkflow from '../models/workflow.js';
import * as DBTool from '../models/tool.js';
import { validInteger, convertLocalToUTC } from '../utils/utli.js';

import CustomError from '../utils/errors/customError.js';

import BadRequestError from '../utils/errors/badRequestError.js';

import { triggerFunctionMap } from '../config/triggerFunction.js';
import {
  calculateNextExecutionTime,
  triggerIntervalConvert,
} from '../service/calculateTime.js';

// get all workflow info by userId
export const getWorkflowsByUser = async (req, res) => {
  console.debug('@controller getWorkflowsByUser');
  const { id } = req.user;
  const workflows = await DBWorkflow.getWorkflowsByUser(id);
  return res.json({ data: workflows });
};

// Init a new workflow
export const initWorkflow = async (req, res) => {
  console.debug('@controller initWorkflow');
  const { id } = req.user; // user id from jwt
  const workflowId = await DBWorkflow.initWorkflow(id);
  return res.json({ data: workflowId });
};

// Update a Workflow (like trigger type...)
export const updateWorkflow = async (req, res, next) => {
  console.debug('@controller updateWorkflow', req.body);

  const userId = req.user.id;
  const workflowId = req.params.id;
  const { workflowInfo } = req.body;
  const triggerSetting = workflowInfo.jobsInfo;

  if (!validInteger(workflowId)) {
    return next(new BadRequestError('Query Params Error'));
  }

  // Verify this user has permission to modify this workflow.
  const workflowResult = await DBWorkflow.getWorkflowById(workflowId, userId);
  if (!workflowResult) {
    return next(new BadRequestError('No such workflow exists.'));
  }

  // Verify that the workflow trigger function is correct.
  const [triggerInfo] = await DBTool.getTriggers({
    id: workflowInfo.trigger_function_id,
  });
  if (!triggerInfo) {
    return next(new BadRequestError('Query Params Error'));
  }

  // FIXME: 假設前端來的時間是台灣時間, 需轉成UTC時間再計算
  const startTime = new Date(
    convertLocalToUTC(workflowInfo.start_time, 'Asia/Taipei')
  );
  console.debug('@controller time', startTime);

  const triggerIntervalSeconds =
    (triggerIntervalConvert[triggerSetting.interval] ||
      triggerIntervalConvert[triggerInfo.name]) * (triggerSetting.every || 1);

  console.log('trigger type...', triggerInfo.name, triggerSetting.interval);
  console.log('triggerIntervalSeconds', triggerIntervalSeconds);

  const nextExecuteTime = calculateNextExecutionTime(
    triggerSetting.interval || triggerInfo.name,
    triggerIntervalSeconds,
    startTime
  );

  console.log('計算出來的下次執行時間', nextExecuteTime);

  // TODO: if use API

  // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status,
    start_time: startTime,
    next_execute_time: nextExecuteTime,
    trigger_type: triggerInfo.type,
    trigger_interval_seconds: triggerIntervalSeconds,
    trigger_api_route: workflowInfo.trigger_api_route,
    job_qty: workflowInfo.job_qty,
    schedule_interval: triggerInfo.name,
  };
  const result = await DBWorkflow.updateWorkflow(workflowId, necessaryInfo);
  return res.json({ data: result });
};

// active or inactive workflow
// FIXME: 不和 update 共用, 因為可能需要幫他修改 execution_time >> 需要去確認 DB 的 trigger 模式是什麼
// inactive >> active 計算方式可能會不一樣
export const changeWorkflowStatus = async (req, res, next) => {
  console.log('@updateWorkflowStatus controller');
  console.log('request Body', req.body);
  const workflowId = req.params.id;
  const { changeStatus } = req.body;

  // 驗證id是否為數字
  if (!validInteger(workflowId)) {
    return next(new BadRequestError('Query Params Error'));
  }

  // 沒有給 changeStatus
  if (!changeStatus) {
    return next(new BadRequestError('Query Params Error'));
  }

  // 確認是否有該 workflow
  const workflow = await DBWorkflow.getWorkflowById(workflowId, req.user.id);
  if (!workflow) {
    return next(new BadRequestError('Query Params Error'));
  }
  // 檢查是否有設定trigger
  if (!workflow.trigger_type) {
    return next(
      new BadRequestError('Query Params Error(trigger type undefined)')
    );
  }
  // 檢查是否有設定job
  if (!workflow.job_qty) {
    return next(new BadRequestError('Query Params Error(empty job)'));
  }

  // calculate next execution time
  const startTime = new Date(workflow.start_time);

  console.log('workflow', workflow);
  const nextExecuteTime = calculateNextExecutionTime(
    workflow.schedule_interval,
    workflow.trigger_interval_seconds,
    startTime
  );

  console.log('nextExecuteTime', nextExecuteTime);

  // update DB data
  const updateResult = await DBWorkflow.updateWorkflow(workflowId, {
    status: changeStatus,
    next_execute_time: nextExecuteTime,
  });
  console.log('active...更新結果', updateResult);
  return res.json({ data: updateResult });
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

  if (!validInteger(insertJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  if (!validInteger(workflowId)) {
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

  if (!validInteger(updateJobSeq)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 驗證id是否為數字
  if (!validInteger(jobId)) {
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
  if (!validInteger(workflowId)) {
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
  // const startTime = new Date(workflowInfo.start_time);

  // 假設前端來的時間是台灣時間, 需轉成UTC時間再計算
  const startTime = new Date(convertLocalToUTC(workflowInfo.start_time));

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
    start_time: startTime,
    next_execute_time: nextExecuteTime, // date.format(nextExecuteTime, 'YYYY-MM-DD HH:mm:ss'),
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
  // FIXME: return ??
  return res.json({ data: result });
};

// Edit Workflow 用
export const editWorkflow = async (req, res, next) => {
  console.log('@Edit Workflow controller...');
  const { workflowId } = req.params;
  console.log('workflowId', workflowId);

  // 驗證id是否為數字
  if (!validInteger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  const data = await DBWorkflow.getWorkflowAndJobById(workflowId);

  console.log('Edit workflow data...', data);

  if (data.length === 0) {
    return next(new CustomError('Not Found', 404));
  }

  // 轉換custom 時間
  // FIXME: 除了custom, 其他範例的話 要給前端every時間嗎？
  const every = data[0].trigger_interval_seconds / 60 || 60; // 如果之前沒填, 就給60分鐘

  // 處理只有 trigger 的 Workflow
  if (!data[0].job_qty) {
    const workflowObj = {
      workflow_id: data[0].workflow_id,
      workflow_name: data[0].workflow_name,
      trigger_function_id: triggerFunctionMap[data[0].schedule_interval] || 3, // 如果之前沒填, 就給custom
      status: data[0].status,
      settingInfo: {
        job_qty: data[0].job_qty,
        start_time: data[0].start_time, // date.format(data[0].start_time, 'YYYY-MM-DD HH:mm:ss'), // mysql取得的為UTC時間
        trigger_type: data[0].trigger_type,
        customer_input: {
          start_time: data[0].start_time, // daily, weekly, monthly 都只要start_time即可
          every,
          interval: 'minute', // FIXME: 先轉成minute, create 的時候沒有紀錄
        },
      },
    };

    return res.json({ data: [workflowObj] });
  }

  // Create the first object
  const firstObj = {
    workflow_id: data[0].workflow_id,
    workflow_name: data[0].workflow_name,
    trigger_function_id: triggerFunctionMap[data[0].schedule_interval], // trigger_funcition數量不多, 利用constant轉換
    status: data[0].status,
    settingInfo: {
      job_qty: data[0].job_qty,
      start_time: data[0].start_time, // date.format(data[0].start_time, 'YYYY-MM-DD HH:mm:ss'),
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
  return res.json({ data: result });
};

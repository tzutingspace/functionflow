import { StatusCodes } from 'http-status-codes';
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

  // const userId = req.user.id;
  const workflowId = req.params.id;
  const { workflowInfo } = req.body;
  const triggerSetting = workflowInfo.jobsInfo;

  // Verify that the workflow trigger function is correct.
  const triggerId = workflowInfo.trigger_function_id;
  const [triggerInfo] = await DBTool.getTriggers({ id: triggerId });
  if (!triggerInfo) {
    return next(new BadRequestError('Query Params Error'));
  }

  const startTime = new Date(
    convertLocalToUTC(workflowInfo.start_time, 'Asia/Taipei')
  );

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

// switch active or inactive workflow
// different with update controller, cause start time data from db
export const changeWorkflowStatus = async (req, res, next) => {
  console.log('@updateWorkflowStatus controller');
  console.log('request Body', req.body);
  const workflowId = req.params.id;
  const { changeStatus } = req.body;
  const workflow = req.workflowDatabaseResult;

  if (!['active', 'inactive'].includes(changeStatus)) {
    return next(new BadRequestError('Query Params Error'));
  }

  // Check the trigger and jobs set up.
  if (!workflow.trigger_type || !workflow.job_qty) {
    return next(
      new BadRequestError('Missing information(trigger or job undefined)')
    );
  }

  // calculate next execution time
  const startTime = new Date(workflow.start_time);
  const nextExecuteTime = calculateNextExecutionTime(
    workflow.schedule_interval,
    workflow.trigger_interval_seconds,
    startTime
  );

  console.log('calculate nextExecuteTime', nextExecuteTime);

  // update DB data
  const updateResult = await DBWorkflow.updateWorkflow(workflowId, {
    status: changeStatus,
    next_execute_time: nextExecuteTime,
  });
  return res.json({ data: updateResult });
};

// DELETE Workflows
export const deleteWorkflows = async (req, res) => {
  console.debug('@delete workflows controller', req.body);
  const userId = req.user.id;
  const { ids } = req.body;

  await Promise.all(
    ids.map(async (workflowId) => {
      const result = await DBWorkflow.deleteWorkflow(workflowId, userId);
      if (result === 1) {
        DBWorkflow.deletejobs(workflowId);
      }
    })
  );

  return res.json({ data: 'finish delete' });
};

// DEPLOY ALL WORKFLOW
export const deployWorkflow = async (req, res, next) => {
  console.log('@controller deployWorkflow', req.body);

  const { workflowInfo, jobsInfo } = req.body;
  const triggerSetting = workflowInfo.jobsInfo;
  const workflowId = req.params.id;

  // Verify that the workflow trigger function is correct.
  const triggerId = workflowInfo.trigger_function_id;
  const [triggerInfo] = await DBTool.getTriggers({ id: triggerId });
  if (!triggerInfo) {
    return next(new BadRequestError('Query Params Error'));
  }

  const startTime = new Date(
    convertLocalToUTC(workflowInfo.start_time, 'Asia/Taipei')
  );

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
    status: workflowInfo.status || 'active',
    start_time: startTime,
    next_execute_time: nextExecuteTime,
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

import { StatusCodes } from 'http-status-codes';
import date from 'date-and-time';
import * as DBWorkflow from '../models/workflow.js';
import * as DBTool from '../models/tool.js';
import { validInteger, convertLocalToUTC } from '../utils/utli.js';
import CustomError from '../utils/errors/customError.js';

import { triggerFunctionMap } from '../config/triggerFunction.js';

// Get old Workflow (Only workflow)
// FIXME: by workflowID >> a workflow
// 需驗證身分
export const getWorkflow = async (req, res, next) => {
  console.log('@controller getWorkflow');
  const { id } = req.params;
  if (!validInteger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await DBWorkflow.getWorkflowById(id);
  return res.json({ data: workflow });
};

// FIXME: by userID >> workflowS
export const getWorkflowByUser = async (req, res, next) => {
  console.log('@controller getWorkflowByUser');
  const { id } = req.user;
  if (!validInteger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  const workflow = await DBWorkflow.getWorkflowByUser(id);

  console.log('workflow', workflow);

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

// Update a Workflow (內容更新)
export const updateWorkflow = async (req, res, next) => {
  console.log('@controller updateWorkflow');
  console.log('request Body', req.body);
  const { workflowInfo } = req.body;
  const workflowId = req.params.id;
  // 驗證id是否為數字
  if (!validInteger(workflowId)) {
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

  // 假設前端來的時間是台灣時間, 需轉成UTC時間再計算
  // const startTime = new Date(workflowInfo.start_time);
  const startTime = new Date(convertLocalToUTC(workflowInfo.start_time));
  console.log('@controller time', startTime);

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
  } else {
    // FIXME: input invaildation
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  console.log('計算出來的下次執行時間', nextExecuteTime);

  // TODO: 如果是API???

  // // 僅留可update項目, undefined 先記錄, model會filter
  const necessaryInfo = {
    name: workflowInfo.name,
    status: workflowInfo.status,
    start_time: startTime, // workflowInfo.start_time,
    next_execute_time: nextExecuteTime, // date.format(nextExecuteTime, 'YYYY-MM-DD HH:mm:ss'),
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
export const updataWorkflowStatus = async (req, res, next) => {
  console.log('@updateWorkflowStatus controller');
  console.log('request Body', req.body);
  const workflowId = req.params.id;
  const { changeStatus } = req.body;
  // 驗證id是否為數字
  if (!validInteger(workflowId)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 沒有給 changeStatus
  if (!changeStatus) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 確認是否有該 worflow
  const workflow = await DBWorkflow.getWorkflowById(workflowId);
  console.log('目前workflow狀況', workflow);

  if (!workflow) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // active >> inactive 直接關閉
  if (changeStatus === 'inactive') {
    const updateResult = await DBWorkflow.updateWorkflow(workflowId, {
      status: changeStatus,
    });
    console.log('更新結果', updateResult);

    return res.json({ data: updateResult.info });
  }
  // draft & inactive >> active

  // 檢查是否有設定trigger
  if (!workflow.trigger_type) {
    return next(
      new CustomError(
        'Query Params Error(trigger type undefined)',
        StatusCodes.BAD_REQUEST
      )
    );
  }
  // 檢查是否有設定job
  if (!workflow.job_qty) {
    return next(
      new CustomError('Query Params Error(empty job)', StatusCodes.BAD_REQUEST)
    );
  }

  // 如果是trigger type schedule 要重新計算下次 execution_time
  const currentDate = new Date();
  console.log('當下時間', currentDate);
  const startTime = new Date(workflow.start_time);
  let nextExecuteTime;
  // 計算最接近當下的基準日期
  const newDate = new Date(
    Date.UTC(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      startTime.getUTCHours(),
      startTime.getUTCMinutes(),
      startTime.getUTCSeconds(),
      startTime.getUTCMilliseconds()
    )
  );

  // console.log('newDate', newDate);
  if (workflow.schedule_interval === 'custom') {
    // 'custom' >> 將日期變成當下日期後計算
    nextExecuteTime = date.addSeconds(
      newDate,
      parseInt(workflow.trigger_interval_seconds, 10)
    );
    // FIXME: 可以直接計算嗎？
    while (nextExecuteTime < currentDate) {
      nextExecuteTime = date.addSeconds(
        nextExecuteTime,
        parseInt(workflow.trigger_interval_seconds, 10)
      );
    }
  } else if (workflow.schedule_interval === 'daily') {
    // nextExecuteTime = date.addDays(newDate, 1);
    // console.log('@daily', nextExecuteTime);
    // 如果 nextExecuteTime 已過當下時間,
    if (nextExecuteTime < currentDate) {
      nextExecuteTime = date.addDays(nextExecuteTime, 1);
    }
  } else if (workflow.schedule_interval === 'weekly') {
    // 計算出距離今天最近的同星期的日期
    const targetDayOfWeek = startTime.getDay(); // 取得星期幾
    const nowDayOfWeek = currentDate.getDay(); // 取得今天是星期幾

    const daysUntilNextTargetDay = (targetDayOfWeek + 7 - nowDayOfWeek) % 7; // 計算距離今天最近的同星期的日期還有幾天

    nextExecuteTime = new Date(
      currentDate.getTime() + daysUntilNextTargetDay * 24 * 60 * 60 * 1000
    );

    // 將時間設定為原本的時間
    nextExecuteTime.setUTCHours(startTime.getUTCHours());
    nextExecuteTime.setUTCMinutes(startTime.getUTCMinutes());
    nextExecuteTime.setUTCSeconds(startTime.getUTCSeconds());
    nextExecuteTime.setUTCMilliseconds(startTime.getUTCMilliseconds());

    // 如果 nextExecuteTime 已過當下時間,
    if (nextExecuteTime < currentDate) {
      nextExecuteTime = date.addDays(nextExecuteTime, 7);
    }
  } else if (workflow.schedule_interval === 'monthly') {
    // 計算出距離今天最近的月份日期
    const startMonth = startTime.getMonth(); // 開始日期的月份
    const nowMonth = currentDate.getMonth(); // 現在的月份
    const monthDiff = nowMonth - startMonth; // 計算月份差距
    nextExecuteTime = date.addMonths(startTime, monthDiff);

    // console.log('當下時間', currentDate);
    // console.log('下次執行時間', nextExecuteTime);

    // 如果 nextExecuteTime 已過當下時間,
    if (nextExecuteTime < currentDate) {
      nextExecuteTime = date.addMonths(nextExecuteTime, 1);
    }
  }
  console.log('nextExecuteTime', nextExecuteTime);

  // 更新資料庫資料
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

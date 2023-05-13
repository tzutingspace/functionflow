import * as DBInstances from '../models/instance.js';
import { getNowTime } from '../utils/utli.js';
import { putToSQS } from '../utils/putToSQS.js';
import BadRequestError from '../utils/errors/badRequestError.js';

import { sendTriggerFinish } from '../utils/socketIO.js';

export const manualTriggerWorkflow = async (req, res, next) => {
  console.debug('@controller manual Trigger');

  const { socketId } = req.body;
  const workflowInfo = req.workflowDatabaseResult;

  if (!workflowInfo.job_qty) {
    return next(new BadRequestError('No Job can be triggerd'));
  }

  // create workflow instances
  workflowInfo.status = 'queued';
  workflowInfo.execution_time = getNowTime(); // convert to UTC
  workflowInfo.manual_trigger = 't';
  workflowInfo.end_time = null;

  // create workflow instance and job instance
  const readyToQueueObj = await DBInstances.createInstances(workflowInfo);

  if (!readyToQueueObj) {
    return next(new BadRequestError('Create instances encountered an error'));
  }

  readyToQueueObj.target_queue = 'manualTriggerQueue';
  readyToQueueObj.socket_id = socketId;

  // FIXME: SQS結果確認 testing 先關閉
  // await putToSQS(JSON.stringify(readyToQueueObj));
  // 放進sqs test run
  return res.json({ data: readyToQueueObj });
};

export const handleTriggerFinish = (req, res) => {
  console.debug('@triggerFinish req.body', req.body);

  const { socketId, data } = req.body;

  sendTriggerFinish(socketId, data);

  return res.send({ data: 'accept' });
};

import { StatusCodes } from 'http-status-codes';
import * as DBWorkflow from '../models/workflow.js';
import * as DBinstances from '../models/instances.js';
import { vaildInterger, getNowTime } from '../utils/utli.js';
import { putToSQS } from '../utils/putToSQS.js';
import CustomError from '../utils/customError.js';

export const manualTriggerWorkflow = async (req, res, next) => {
  console.log('@controller manual Trigger');
  console.log('req body', req);
  const { id } = req.params;
  const { socketId } = req.body;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 抓出workflow 資訊
  const workflowInfo = await DBWorkflow.getWorkflowById(id);

  // 如果為空, 報錯
  if (!workflowInfo) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 建立 workflow instances
  workflowInfo.status = 'queued'; // 準備丟進queue
  workflowInfo.execution_time = getNowTime(); // 和lambda一樣用台灣時間
  workflowInfo.manual_trigger = 't'; // 手動測試
  workflowInfo.end_time = null;

  console.log('workflow', workflowInfo);

  // 建立workflow instance and job instance , 並回傳job資訊
  const readyToQueueObj = await DBinstances.createInstances(workflowInfo);
  readyToQueueObj.target_queue = 'manualTriggerQueue';
  readyToQueueObj.socketId = socketId; // FIXME: 給id
  console.log('建立instances回傳的結果', readyToQueueObj);

  // FIXME: SQS結果確認
  // await putToSQS(JSON.stringify(readyToQueueObj));
  // 放進sqs test run
  return res.json({ data: readyToQueueObj });
};
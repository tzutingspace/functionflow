import { StatusCodes } from 'http-status-codes';
import * as DBWorkflow from '../models/workflow.js';
import * as DBinstances from '../models/instances.js';
import { vaildInterger, getNowTime } from '../utils/utli.js';
import { putToSQS } from '../utils/putToSQS.js';
import CustomError from '../utils/customError.js';

export const manualTriggerWorkflow = async (req, res, next) => {
  console.log('@controller manual Trigger');
  const { id } = req.params;

  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 抓出workflow 資訊
  const workflowInfo = await DBWorkflow.getWorkflowById(id);

  // 如果為空, 報錯
  if (!workflowInfo) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }

  // 更新建立 workflow 資訊

  workflowInfo.next_execute_time =
    workflowInfo.next_execute_time.toLocaleString();
  workflowInfo.status = 'queued';
  workflowInfo.execution_time = getNowTime();
  workflowInfo.trigger_type = 'manual'; // 使用者手動測試
  workflowInfo.external_trigger = 't';

  console.log('workflow', workflowInfo);

  // 建立workflow instance and job instance , 並回傳job資訊
  const result = await DBinstances.createInstances(workflowInfo);
  console.log('model 回來的結果', result);

  const resultSQS = await putToSQS(JSON.stringify(result));
  // 放進sqs test run
  return res.json({ data: '開發中' });
};

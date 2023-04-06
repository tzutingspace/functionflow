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

export const createWorkflow = async (req, res) => {
  console.log('@controller createWorkflow');
  const workflowInfo = {
    user_id: 1,
    workflow_status: 'active',
    start_time: getNowTime(),
    trigger_type: 'schedule',
    trigger_interval: '@dialy',
    next_execute_time: calculateTime(getNowTime(), 1440),
    tigger_api_route: null,
    job_number: 2,
    trigger_interval_minutes: 1440,
  };
  const jobsInfo = {
    1: {
      job_name: 'get_weather_temp',
      function_id: 1,
      job_priority: 1,
      config: JSON.stringify({ city: '澎湖縣', condition: 'MinT, 22' }),
    },
    2: {
      job_name: 'send_message_discord',
      job_priority: 2,
      function_id: 2,
      config: JSON.stringify({
        user_message: '天氣過於低溫，請多穿衣服，(express)',
        user_channel_ID: '1091690518016163842',
      }),
    },
  };

  const result = await Workflow.insertWorkflow(workflowInfo, jobsInfo);
  return res.json({ msg: result });
};

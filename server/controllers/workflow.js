import * as Workflow from '../models/workflow.js';
import { vaildInterger } from '../utils/utli.js';
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
  return res.json({ msg: 'test' });
};

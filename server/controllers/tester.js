import { StatusCodes } from 'http-status-codes';
import * as DBinstances from '../models/instances.js';
import { vaildInterger } from '../utils/utli.js';
import CustomError from '../utils/customError.js';

export const testJob = async (req, res, next) => {
  console.log('@controller testJob');
  const { id } = req.params;
  if (!vaildInterger(id)) {
    return next(new CustomError('Query Params Error', StatusCodes.BAD_REQUEST));
  }
  // 抓出job資訊
  const result = await DBinstances.createInstances(id);
  return res.json({ data: result });
};

export const testWorkflow = async (req, res) => {
  console.log(req);
  return res.json({ data: '開發中' });
};

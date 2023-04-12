import * as DBTool from '../models/tool.js';
import { StatusCodes } from 'http-status-codes';
import { CustomError } from '../utils/customError.js';

export const getTools = async (req, res, next) => {
  console.log('@contoller getTools');
  const tools = await DBTool.getTools();
  console.log(tools);
  return res.json({ msg: tools });
};

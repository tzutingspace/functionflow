// import { StatusCodes } from 'http-status-codes';
import * as DBTool from '../models/tool.js';
// import CustomError from '../utils/customError.js';

const getTools = async (req, res) => {
  console.log('@contoller getTools');
  const tools = await DBTool.getTools();
  console.log(tools);
  return res.json({ msg: tools });
};

export default getTools;

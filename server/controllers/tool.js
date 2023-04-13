// import { StatusCodes } from 'http-status-codes';
import * as DBTool from '../models/tool.js';
// import CustomError from '../utils/customError.js';

const getTools = async (req, res) => {
  console.log('@contoller getTools');
  const id = req.params.id === undefined ? 0 : Number(req.params.id);
  const requriement = id === 0 ? {} : { id };

  const tools = await DBTool.getTools(requriement);
  return res.json({ data: tools });
};

export default getTools;

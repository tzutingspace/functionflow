// import { StatusCodes } from 'http-status-codes';
import * as DBTool from '../models/tool.js';
// import CustomError from '../utils/customError.js';

const getTools = async (req, res) => {
  console.log('@contoller getTools');
  console.log(req.params);
  const type = req.params.type === undefined ? 'all' : req.params.type;
  const requriement = type === 'all' ? {} : { type };
  const tools = await DBTool.getTools(requriement);
  return res.json({ data: tools });
};

const searchTool = async (req, res) => {
  console.log('@contoller searchTool');
  const id = req.params.id === undefined ? 1 : Number(req.params.id);
  const requriement = { id };
  const tool = await DBTool.getTools(requriement);
  return res.json({ data: tool });
};

export { getTools, searchTool };

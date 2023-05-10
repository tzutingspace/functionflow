// import { StatusCodes } from 'http-status-codes';
import * as DBTool from '../models/tool.js';
// import CustomError from '../utils/customError.js';

export const getTriggers = async (req, res) => {
  console.log('@controller getTriggers');
  const triggers = await DBTool.getTriggers();
  return res.json({ data: triggers });
};

export const searchTrigger = async (req, res) => {
  console.log('@controller searchTrigger');
  const id = req.params.id === undefined ? 1 : Number(req.params.id);
  const tool = await DBTool.getTriggers({ id });
  return res.json({ data: tool });
};

export const getTools = async (req, res) => {
  console.log('@controller getTools');
  const type = req.params.type === undefined ? 'all' : req.params.type;
  const tools = await DBTool.getTools(type === 'all' ? {} : { type });
  return res.json({ data: tools });
};

export const searchTool = async (req, res) => {
  console.log('@controller searchTool');
  const id = req.params.id === undefined ? 1 : Number(req.params.id);
  const tool = await DBTool.getTools({ id });
  return res.json({ data: tool });
};

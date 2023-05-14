import * as DBTool from '../models/tool.js';
import { validInteger } from '../utils/utils.js';
import BadRequestError from '../utils/errors/badRequestError.js';

export const getTriggers = async (req, res) => {
  console.debug('@controller getTriggers');
  const triggers = await DBTool.getTriggers();
  return res.json({ data: triggers });
};

export const searchTrigger = async (req, res, next) => {
  console.debug('@controller searchTrigger');

  if (!validInteger(req.params.id) || Number(req.params.id) === 0) {
    return next(new BadRequestError('Trigger id is not correct'));
  }

  const id = Number(req.params.id);
  const tool = await DBTool.getTriggers({ id });
  return res.json({ data: tool });
};

export const getTools = async (req, res) => {
  console.debug('@controller getTools');

  const { type } = req.params;
  const tools = await DBTool.getTools(type === 'all' ? {} : { type });
  return res.json({ data: tools });
};

export const searchTool = async (req, res, next) => {
  console.debug('@controller searchTool');

  if (!validInteger(req.params.id) || Number(req.params.id) === 0) {
    return next(new BadRequestError('Trigger id is not correct'));
  }

  const id = Number(req.params.id);

  const tool = await DBTool.getTools({ id });
  return res.json({ data: tool });
};

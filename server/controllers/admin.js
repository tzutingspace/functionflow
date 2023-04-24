import { insertFunction } from '../models/admin.js';

export const createFunciton = async (req, res) => {
  console.log('@controller createFunction');
  console.log('request Body', req.body);

  const { functionInfo } = req.body;
  functionInfo.template_input = JSON.stringify(functionInfo.template_input);
  functionInfo.template_output = JSON.stringify(functionInfo.template_output);

  const result = await insertFunction(functionInfo);
  return res.json({ data: result });
};
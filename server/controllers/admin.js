import { insertFunction } from '../models/admin.js';

export const createFunction = async (req, res) => {
  console.debug('@controller createFunction');
  console.debug('request Body', req.body);

  const { functionInfo } = req.body;
  functionInfo.template_input = JSON.stringify(functionInfo.template_input);
  functionInfo.template_output = JSON.stringify(functionInfo.template_output);

  const result = await insertFunction(functionInfo);
  return res.json({ data: result });
};

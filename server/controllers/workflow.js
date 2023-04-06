import * as Workflow from '../models/workflow.js';

export const getWorkflow = async (req, res) => {
  const { id } = req.params;
  console.log('@controller getWorkflow');
  const wf = await Workflow.getWorkflowById(id);
  return res.json({ msg: wf });
};

export const createWorkflow = async (req, res) => {
  console.log('@controller createWorkflow');
  return res.json({ msg: 'test' });
};

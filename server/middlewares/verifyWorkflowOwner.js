import { validInteger } from '../utils/utli.js';

import BadRequestError from '../utils/errors/badRequestError.js';
import * as DBWorkflow from '../models/workflow.js';

export const verifyWorkflowOwner = async (req, res, next) => {
  console.debug('@verifyWorkflowOwner middleware');
  console.debug('req.params', req.params);
  console.debug('req.body', req.body);

  const userId = req.user.id;
  const { workflowInfo } = req.body;
  const workflowId = workflowInfo ? workflowInfo.id : req.params.id;

  console.debug('workflowId:', workflowId);

  if (!validInteger(workflowId)) {
    return next(new BadRequestError('Query Params Error'));
  }

  // Verify this user has permission to modify this workflow.
  const workflowResult = await DBWorkflow.getWorkflowById(workflowId, userId);
  if (!workflowResult) {
    return next(new BadRequestError('No such workflow exists.'));
  }

  req.workflowDatabaseResult = workflowResult;
  return next();
};

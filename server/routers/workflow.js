import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { verifyWorkflowOwner } from '../middlewares/verifyWorkflowOwner.js';
import {
  getWorkflowsByUser,
  initWorkflow,
  updateWorkflow,
  changeWorkflowStatus,
  deployWorkflow,
  deleteWorkflows,
  getWorkflowAndJob,
} from '../controllers/workflow.js';

const router = Router();

// get workflows by userId
router.get('/workflows', verifyJWT, wrapAsync(getWorkflowsByUser));

// create (init) workflow
router.post('/workflow', verifyJWT, wrapAsync(initWorkflow));

// update workflow (trigger info...)
router.put(
  '/workflow/:id',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(updateWorkflow)
);

// switch workflow status(active , inactive)
router.put(
  '/workflow/:id/status',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(changeWorkflowStatus)
);

// deploy all workflow
router.put(
  '/workflow/:id/deploy',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(deployWorkflow)
);

// get workflow and job (for edit)
router.get(
  '/workflow-and-job/:id',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(getWorkflowAndJob)
);

// delete workflows
router.delete('/workflows', verifyJWT, wrapAsync(deleteWorkflows));

export { router };

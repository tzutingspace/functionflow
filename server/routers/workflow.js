import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import {
  getWorkflowsByUser,
  initWorkflow,
  updateWorkflow,
  updataWorkflowStatus,
  createJob,
  updateJob,
  deployWorkflow,
  deleteWorkflows,
  editWorkflow,
} from '../controllers/workflow.js';

const router = Router();

// get workflows by userId
router.get('/workflows', verifyJWT, wrapAsync(getWorkflowsByUser));

// Create (init) workflow
router.post('/workflow', verifyJWT, wrapAsync(initWorkflow));

// FIXME: update要驗證身份
router.put('/workflow/:id', wrapAsync(updateWorkflow));

// FIXME:  workflow/:id/status
router.put('/workflow/status/:id', wrapAsync(updataWorkflowStatus));

// FIXME: RESTFULL?
router.get('/workflow-and-job/:workflowId', verifyJWT, wrapAsync(editWorkflow));

// FIXME: 驗證身份?
router.post('/job', wrapAsync(createJob));

router.put('/job/:id', wrapAsync(updateJob));

router.put('/workflow/deploy/:id', wrapAsync(deployWorkflow));

router.delete('/workflows', wrapAsync(deleteWorkflows));

export { router };

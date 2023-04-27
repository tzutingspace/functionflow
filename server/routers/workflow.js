import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import {
  getWorkflow,
  getWorkflowByUser,
  initWorkflow,
  updateWorkflow,
  createJob,
  updateJob,
  deployWorkflow,
  deleteWorkflows,
  editWorkflow,
} from '../controllers/workflow.js';

const router = Router();

router.get('/workflow/:id', wrapAsync(getWorkflow));

router.get('/workflow/user/:id', verifyJWT, wrapAsync(getWorkflowByUser));

// FIXME: RESTFULL?
router.get('/workflowandjob/:workflowId', verifyJWT, wrapAsync(editWorkflow));

// FIXME: update要驗證身份
router.put('/workflow/:id', wrapAsync(updateWorkflow));

router.post('/workflow', verifyJWT, wrapAsync(initWorkflow));

// FIXME: 驗證身份?
router.post('/job', wrapAsync(createJob));

router.put('/job/:id', wrapAsync(updateJob));

router.put('/workflow/depoly/:id', wrapAsync(deployWorkflow));

router.delete('/workflows', wrapAsync(deleteWorkflows));

export { router };

import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import {
  getWorkflow,
  getWorkflowByUser,
  initWorkflow,
  updateWorkflow,
  createJob,
  updateJob,
  deployWorkflow,
  deleteWorkflows,
} from '../controllers/workflow.js';

const router = Router();

router.get('/workflow/:id', wrapAsync(getWorkflow));

router.get('/workflow/user/:id', wrapAsync(getWorkflowByUser));

router.put('/workflow/:id', wrapAsync(updateWorkflow));

router.post('/workflow', wrapAsync(initWorkflow));

router.post('/job', wrapAsync(createJob));

router.put('/job/:id', wrapAsync(updateJob));

router.put('/workflow/depoly/:id', wrapAsync(deployWorkflow));

router.delete('/workflows', wrapAsync(deleteWorkflows));

export { router };

import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import {
  getWorkflow,
  initWorkflow,
  updateWorkflow,
  createJob,
  updateJob,
} from '../controllers/workflow.js';

const router = Router();

router.get('/workflow/:id', wrapAsync(getWorkflow));

router.put('/workflow/:id', wrapAsync(updateWorkflow));

router.post('/workflow', wrapAsync(initWorkflow));

router.post('/job', wrapAsync(createJob));

router.put('/job/:id', wrapAsync(updateJob));

export { router };

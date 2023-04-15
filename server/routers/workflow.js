import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import {
  getWorkflow,
  initWorkflow,
  updateWorkflow,
} from '../controllers/workflow.js';

const router = Router();

router.get('/workflow/:id', wrapAsync(getWorkflow));

router.put('/workflow/:id', wrapAsync(updateWorkflow));

router.post(
  '/workflow',
  /* authentication(USER_ROLE.ALL), */ wrapAsync(initWorkflow)
);

export { router };

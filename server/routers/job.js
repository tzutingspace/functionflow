import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { verifyWorkflowOwner } from '../middlewares/verifyWorkflowOwner.js';
import { createJob, updateJob } from '../controllers/job.js';

const router = Router();

router.post(
  '/job',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(createJob)
);

router.put(
  '/job/:id',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(updateJob)
);

export { router };

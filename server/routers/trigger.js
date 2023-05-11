import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { verifyJWT } from '../middlewares/verifyJWT.js';
import {
  manualTriggerWorkflow,
  handleTriggerFinish,
} from '../controllers/trigger.js';

const router = Router();

router.post(
  '/trigger/workflow/:id',
  verifyJWT,
  wrapAsync(manualTriggerWorkflow)
);

router.post('/trigger-finish', wrapAsync(handleTriggerFinish));

export { router };

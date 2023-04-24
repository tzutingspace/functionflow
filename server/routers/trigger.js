import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { manualTriggerWorkflow } from '../controllers/trigger.js';

const router = Router();

router.get('/trigger/workflow/:id', wrapAsync(manualTriggerWorkflow));

export { router };

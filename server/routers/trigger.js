import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { manualTriggerWorkflow } from '../controllers/trigger.js';

const router = Router();

// router.post('/tester/job/:id', wrapAsync(testJob));

router.get('/trigger/workflow/:id', wrapAsync(manualTriggerWorkflow));

export { router };

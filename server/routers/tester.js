import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { testJob, testWorkflow } from '../controllers/tester.js';

const router = Router();

router.post('/tester/job/:id', wrapAsync(testJob));

router.post('/tester/workflow/:id', wrapAsync(testWorkflow));

export { router };

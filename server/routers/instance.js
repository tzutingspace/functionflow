import { Router } from 'express';

import wrapAsync from '../utils/wrapAsync.js';

import { searchInstancesHistory } from '../controllers/instance.js';

const router = Router();

// FIXME: RESTFUL?
router.get('/instance/:workflowId', wrapAsync(searchInstancesHistory));

export { router };

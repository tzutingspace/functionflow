import { Router } from 'express';

import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { searchInstancesHistory } from '../controllers/instance.js';

const router = Router();

// FIXME: RESTFULL?
router.get(
  '/instance/:workflowId',
  verifyJWT,
  wrapAsync(searchInstancesHistory)
);

export { router };

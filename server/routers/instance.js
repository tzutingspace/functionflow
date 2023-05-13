import { Router } from 'express';

import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { verifyWorkflowOwner } from '../middlewares/verifyWorkflowOwner.js';
import { searchInstancesHistory } from '../controllers/instance.js';

const router = Router();

router.get(
  '/instances/:id',
  verifyJWT,
  wrapAsync(verifyWorkflowOwner),
  wrapAsync(searchInstancesHistory)
);

export { router };

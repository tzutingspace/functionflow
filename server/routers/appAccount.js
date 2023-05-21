import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';

import { getAppAccount } from '../controllers/appAccounts.js';

const router = Router();

router.get('/app-accounts', verifyJWT, wrapAsync(getAppAccount));

export { router };

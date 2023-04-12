import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import getTools from '../controllers/tool.js';

const router = Router();

router.get('/tools', wrapAsync(getTools));

export default router;

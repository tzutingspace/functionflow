import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { createFunciton } from '../controllers/admin.js';

const router = Router();

router.post('/createfunction', wrapAsync(createFunciton));

export { router };

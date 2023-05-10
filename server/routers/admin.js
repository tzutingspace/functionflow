import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { createFunction } from '../controllers/admin.js';

const router = Router();

router.post('/create-function', wrapAsync(createFunction));

export { router };

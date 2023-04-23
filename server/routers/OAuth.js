import { Router } from 'express';

import wrapAsync from '../utils/wrapAsync.js';
import { OAuth } from '../controllers/OAuth.js';

const router = Router();

router.get('/token', wrapAsync(OAuth));

export { router };

import { Router } from 'express';

import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import { OAuth } from '../controllers/OAuth.js';

const router = Router();

router.get('/token', verifyJWT, wrapAsync(OAuth));

export { router };

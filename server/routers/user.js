import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { verifyJWT } from '../middlewares/verifyJWT.js';
import { signup, login, getProfile } from '../controllers/user.js';

const router = Router();

router.get('/', (req, res) => res.json({ data: 'user route....' }));

router.post('/signup', wrapAsync(signup));

router.post('/login', wrapAsync(login));

router.get('/profile', verifyJWT, wrapAsync(getProfile));

export { router };

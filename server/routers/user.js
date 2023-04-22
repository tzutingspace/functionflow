import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { signup, signin } from '../controllers/user.js';

const router = Router();

router.get('/', (req, res) => res.send('user route....'));

router.post('/signup', wrapAsync(signup));

router.post('/signin', wrapAsync(signin));

export { router };

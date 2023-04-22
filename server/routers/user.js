import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { signup } from '../controllers/user.js';

const router = Router();

router.get('/', (req, res) => res.send('user route....'));

router.post('/signup', wrapAsync(signup));

export { router };

import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { getTriggers, getTools, searchTool } from '../controllers/tool.js';

const router = Router();

router.get('/triggers', wrapAsync(getTriggers));

router.get('/tools/:type?', wrapAsync(getTools));

router.get('/tool/:id?', wrapAsync(searchTool));

export { router };

import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import { getTools, searchTool } from '../controllers/tool.js';

const router = Router();

router.get('/tools/:type?', wrapAsync(getTools));

router.get('/tool/:id?', wrapAsync(searchTool));

export { router };

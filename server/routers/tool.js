import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';

import {
  getTriggers,
  searchTrigger,
  getTools,
  searchTool,
} from '../controllers/tool.js';

const router = Router();

router.get('/triggers', wrapAsync(getTriggers));

router.get('/triggers/:id', wrapAsync(searchTrigger));

router.get(
  '/tools/:type(all|getData|sendData|filterData)',
  wrapAsync(getTools)
);

router.get('/tools/:id', wrapAsync(searchTool));

export { router };

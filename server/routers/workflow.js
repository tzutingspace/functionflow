import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { getWorkflow, createWorkflow } from '../controllers/workflow.js';

const router = Router();

router.get('/workflow/:id', wrapAsync(getWorkflow));

router.post('/workflow', wrapAsync(createWorkflow));

export default router;

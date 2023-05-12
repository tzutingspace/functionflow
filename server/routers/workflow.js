import { Router } from 'express';
import wrapAsync from '../utils/wrapAsync.js';
import { verifyJWT } from '../middlewares/verifyJWT.js';
import {
  getWorkflowByUser,
  initWorkflow,
  updateWorkflow,
  updataWorkflowStatus,
  createJob,
  updateJob,
  deployWorkflow,
  deleteWorkflows,
  editWorkflow,
} from '../controllers/workflow.js';

const router = Router();

// usersId
router.get('/workflow/user/:id', verifyJWT, wrapAsync(getWorkflowByUser));

// FIXME: RESTFULL?
router.get('/workflowandjob/:workflowId', verifyJWT, wrapAsync(editWorkflow));

// FIXME: update要驗證身份
router.put('/workflow/:id', wrapAsync(updateWorkflow));

// FIXME:  workflow/:id/status
router.put('/workflow/status/:id', wrapAsync(updataWorkflowStatus));

// 初始化workflow
// FIXME: 用CREATE
router.post('/workflow', verifyJWT, wrapAsync(initWorkflow));

// FIXME: 驗證身份?
router.post('/job', wrapAsync(createJob));

router.put('/job/:id', wrapAsync(updateJob));

router.put('/workflow/deploy/:id', wrapAsync(deployWorkflow));

router.delete('/workflows', wrapAsync(deleteWorkflows));

export { router };

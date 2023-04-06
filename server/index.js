import express, { json } from 'express';
import dotenv from 'dotenv';

import { CustomError } from './utils/customError.js';
import { StatusCodes } from 'http-status-codes';
import { router as createWorkflowRoute } from './routers/createWorkflow.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// middleware for 解析 request form (body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(json());

app.get('/', async (req, res) => {
  res.json({ status: true, message: 'Our node.js app works' });
});

app.use('/api/createWorkflow', createWorkflowRoute);

// Not Found
app.use((req, res, next) => {
  console.log('request 路徑：', req.originalUrl);
  next(new CustomError('Not Found', 404));
});

// 處理ERROR (Error handler) Express 全域錯誤處理
app.use((err, req, res, next) => {
  console.error('ERROR HANDLER LOG: ', err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
  };
  return res
    .status(customError.statusCode)
    .json({ message: customError.message, status: customError.statusCode });
});

app.listen(PORT, () => console.log(`The application is running on on port ${PORT}`));

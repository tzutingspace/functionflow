import express, { json } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';
import StatusCodes from 'http-status-codes';
import cors from 'cors';

import CustomError from './utils/customError.js';

// ROUTER
import { router as user } from './routers/user.js';
import { router as workflow } from './routers/workflow.js';
import { router as tool } from './routers/tool.js';
import { router as trigger } from './routers/trigger.js';
import { router as admin } from './routers/admin.js';
import { router as OAuth } from './routers/OAuth.js';

dotenv.config();

const app = express();

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.IP_LOCALTION,
    methods: ['GET', 'POST'],
  },
});

const PORT = process.env.PORT || 8080;
app.use(cors());

// middleware for 解析 request form (body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(json());

// for load-blancer health check
app.get('/', (req, res) => {
  res.json({ data: 200 });
});
app.use('/admin', admin);
app.use('/api/user', user);
app.use('/api', workflow);
app.use('/api', tool);
app.use('/api', trigger);
app.use('/api/oauth2', OAuth);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('trigger', (socketId) => {
    socket.join(socketId);
    console.log(`User joined room, Scoket Id: ${socketId}`);
  });

  socket.on('disconnect', () => {
    console.log(`User disconnect: ${socket.id}`);
  });
});

// FIXME: 應該要寫成另一個file
// trigger success
app.post('/triggerFinish', (req, res) => {
  const { socketId, data } = req.body;
  io.to(socketId).emit('triggerFinish', { message: data });
  res.send({ data: 'accept' });
});

// Not Found
app.use((req, res, next) => {
  console.log('request 路徑：', req.originalUrl);
  next(new CustomError('Not Found', 404));
});

// 處理ERROR (Error handler) Express 全域錯誤處理
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('ERROR HANDLER LOG: ', err);
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || 'Internal Server Error',
  };
  return res.status(customError.statusCode).json({
    data: { message: customError.message, status: customError.statusCode },
  });
});

server.listen(PORT, () =>
  console.log(`The application is running on on port ${PORT}`)
);

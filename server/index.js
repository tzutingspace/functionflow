import express, { json } from 'express';
// import { createServer } from 'http';

import dotenv from 'dotenv';
import StatusCodes from 'http-status-codes';
import cors from 'cors';

// import { createSocketIO } from './utils/socketIO.js';
import NotFoundError from './utils/errors/notFoundError.js';

// ROUTER
import { router as user } from './routers/user.js';
import { router as workflow } from './routers/workflow.js';
import { router as job } from './routers/job.js';
import { router as instance } from './routers/instance.js';
import { router as tool } from './routers/tool.js';
import { router as trigger } from './routers/trigger.js';
import { router as admin } from './routers/admin.js';
import { router as OAuth } from './routers/OAuth.js';
import { router as appAccount } from './routers/appAccount.js';

dotenv.config();

// Set up Express
const app = express();

// const PORT = process.env.PORT || 8080;
app.use(
  cors({
    origin: [process.env.IP_LOCATION],
  })
);

// body-parser
app.use(express.urlencoded({ extended: false }));
app.use(json());

// Express Router
// for load-balancer health check
app.get('/health', (req, res) => {
  res.status(200).json({ data: 200 });
});
app.use('/admin', admin);
app.use('/api/user', user);
app.use('/api', workflow);
app.use('/api', job);
app.use('/api', tool);
app.use('/api', trigger);
app.use('/api', instance);
app.use('/api', appAccount);
app.use('/api/oauth2', OAuth);

// Not Found
app.use((req, res, next) => {
  console.error('request path:', req.originalUrl);
  next(new NotFoundError('Not Found'));
});

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

export default app;

// // Set up Server and Socket
// const server = createServer(app);
// createSocketIO(server);

// server.listen(PORT, () =>
//   console.log(`The application is running on on port ${PORT}`)
// );

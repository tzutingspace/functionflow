import { createServer } from 'http';
import app from './index.js';
import { createSocketIO } from './utils/socketIO.js';

// Set up Server and Socket
const server = createServer(app);
createSocketIO(server);

const PORT = process.env.PORT || 8080;

server.listen(PORT, () =>
  console.log(`The application is running on on port ${PORT}`)
);

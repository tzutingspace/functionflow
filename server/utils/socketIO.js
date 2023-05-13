import { Server } from 'socket.io';

let io;

export const createSocketIO = (server) => {
  if (io) return;

  io = new Server(server, {
    cors: {
      origin: process.env.IP_LOCALTION,
    },
  });

  io.on('connection', (socket) => {
    console.debug(`User connected: ${socket.id}`);

    socket.on('trigger', (socketId) => {
      socket.join(socketId);
      console.debug(`User joined room, Socket Id: ${socketId}`);
    });

    socket.on('disconnect', () => {
      console.debug(`User disconnect: ${socket.id}`);
    });
  });
};

export const sendTriggerFinish = (socketId, data) => {
  io.to(socketId).emit('triggerFinish', { message: data });
};

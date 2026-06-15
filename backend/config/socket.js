import { Server } from 'socket.io';

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // Allow Vite dev server or other local clients to connect
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  return io;
};

export const notifyClients = (event, data) => {
  if (io) {
    console.log(`[Socket] Broadcasting event "${event}":`, data);
    io.emit(event, data);
  } else {
    console.warn(`[Socket] Warning: Cannot broadcast event "${event}" because Socket.io is not initialized.`);
  }
};

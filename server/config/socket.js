import { Server } from 'socket.io';
import { getCorsOrigins } from './corsOrigins.js';

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: getCorsOrigins(),
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join_admin', () => {
      socket.join('admins');
      console.log(`Socket ${socket.id} joined admins room`);
    });

    socket.on('join_user', (userId) => {
      socket.join(`user_${userId}`);
      console.log(`Socket ${socket.id} joined user_${userId} room`);
    });

    socket.on('support_message', (payload) => {
      if (!payload?.userId || !payload?.message) return;
      io.to('admins').emit('support_message', payload);
    });

    socket.on('support_reply', (payload) => {
      if (!payload?.targetUserId || !payload?.message) return;
      io.to(`user_${payload.targetUserId}`).emit('support_reply', payload);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

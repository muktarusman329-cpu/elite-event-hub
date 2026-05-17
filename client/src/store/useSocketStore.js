import { create } from 'zustand';
import { io } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000';

export const useSocketStore = create((set, get) => ({
  socket: null,
  connected: false,

  connectSocket: () => {
    const { user } = useAuthStore.getState();
    if (!user || get().socket?.connected) return;

    const existing = get().socket;
    if (existing) existing.disconnect();

    const socket = io(socketUrl, { withCredentials: true, transports: ['websocket', 'polling'] });

    socket.on('connect', () => {
      set({ connected: true });
      if (user.role === 'admin') socket.emit('join_admin');
      else socket.emit('join_user', user.id);
    });

    socket.on('disconnect', () => set({ connected: false }));

    set({ socket });
  },

  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.disconnect();
      set({ socket: null, connected: false });
    }
  },

  on: (event, handler) => {
    const { socket } = get();
    if (!socket) return () => {};
    socket.on(event, handler);
    return () => socket.off(event, handler);
  },
}));

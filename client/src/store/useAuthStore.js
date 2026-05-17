import { create } from 'zustand';
import { useSocketStore } from './useSocketStore';

const loadUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const useAuthStore = create((set) => ({
  user: loadUser(),
  token: localStorage.getItem('token') || null,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    set({ user, token });
    useSocketStore.getState().connectSocket();
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('eliteUser');
    localStorage.removeItem('eliteUserToken');
    useSocketStore.getState().disconnectSocket();
    set({ user: null, token: null });
  },
}));

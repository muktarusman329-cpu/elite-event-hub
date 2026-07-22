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
  authChecked: false,

  setAuthChecked: (v) => set({ authChecked: v }),

  setAuth: (user, token) => {
    if (!user || !token) {
      throw new Error('Cannot store auth state without both user and token.');
    }

    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
    localStorage.setItem('eliteUser', JSON.stringify(user));
    localStorage.setItem('eliteUserToken', token);
    set({ user, token, authChecked: true });
    useSocketStore.getState().connectSocket();
  },

  // set user from session-based auth (no JWT token)
  setUser: (user) => {
    if (!user) return;
    try {
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('token');
      localStorage.setItem('eliteUser', JSON.stringify(user));
      set({ user, token: null, authChecked: true });
      useSocketStore.getState().connectSocket();
    } catch (e) {
      // ignore storage errors
      set({ user, token: null, authChecked: true });
    }
  },

  updateUser: (user) => {
    if (!user) return;
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('eliteUser', JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('eliteUser');
    localStorage.removeItem('eliteUserToken');
    useSocketStore.getState().disconnectSocket();
    set({ user: null, token: null, authChecked: true });
  },
}));

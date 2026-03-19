import { create } from 'zustand';
import api from '../api/axios';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('sses_user') || 'null'),

  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('sses_user', JSON.stringify(data));
    set({ user: data });
    return data;
  },

  logout: () => {
    localStorage.removeItem('sses_user');
    set({ user: null });
  },
}));

export default useAuthStore;

import { writable } from 'svelte/store';

const createAuthStore = () => {
  const { subscribe, set, update } = writable(null);

  return {
    subscribe,
    signin: async () => {
      const response = await fetch('/api/auth/google-url');
      const { url } = await response.json();
      window.location.href = url;
    },
    setUser: (user) => set(user),
    logout: async () => {
      await fetch('/api/auth/logout', { method: 'POST' });
      set(null);
    }
  };
};

export const auth = createAuthStore();
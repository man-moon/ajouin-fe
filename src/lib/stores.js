import { writable } from 'svelte/store';

export const toastMessage = writable(null);
export const ACCESS_TOKEN = writable(null);
export const userId = writable(null);
export const currentPath = writable(null);
export const myBookMark = writable([]);
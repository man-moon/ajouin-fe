import { writable } from 'svelte/store';

export const toastMessage = writable(null);
export const ACCESS_TOKEN = writable(null);
export const userId = writable(null);
export const currentPath = writable(null);
export const bookmarkStore = writable([]);
export const noticeStore = writable([]);
export const reminderStore = writable([]);
export const selectedType = writable('');
export const bookmarkSnapshotStore = writable([]);
export const reminderSnapshotStore = writable([]);
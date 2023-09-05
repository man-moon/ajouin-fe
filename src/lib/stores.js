import { writable } from 'svelte/store';

export const toastMessage = writable(null);
// export const API_BASE_URL = 'https://connect-campus-385299c44bcb100f.elb.ap-northeast-2.amazonaws.com:8080';
export const API_BASE_URL = 'http://localhost:8080';
export const ACCESS_TOKEN = writable(null);
export const userId = writable(null);
export const currentPath = writable(null);
import { writable } from 'svelte/store';

export const currentSelectedTransaction = writable<string | null>(null);
export const isDialogOpen = writable(false);
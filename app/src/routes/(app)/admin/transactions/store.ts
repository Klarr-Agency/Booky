import { writable } from 'svelte/store';

export const currentSelectedTransaction = writable<string | null>(null);
export const currentSelectedLabel = writable<string | null>(null);
export const isTransactionDialogOpen = writable(false);
export const isLabelDialogOpen = writable(false);
export const formSubmitted = writable(false);
export const labelFormSubmitted = writable(false);
export const labelDialogState = writable<string | null>(null);

import { writable } from 'svelte/store';
import { browser } from '$app/environment';

type Theme = 'light' | 'dark';

function getInitialTheme(): Theme {
    if (!browser) return 'light';
    
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) return 'dark';
    
    return 'light';
}

export const theme = writable<Theme>(getInitialTheme());

if (browser) {
    theme.subscribe((value: Theme) => {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
    });
}

export function toggleTheme(): void {
    theme.update((current: Theme) => current === 'light' ? 'dark' : 'light');
}
// src/lib/stores/themes.ts
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

function updateFavicon(theme: Theme): void {
    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement | null;
    if (favicon) {
        favicon.href = theme === 'dark' ? '/favicon-dark.svg' : '/favicon-light.svg';
    }
}

export const theme = writable<Theme>(getInitialTheme());

if (browser) {
    theme.subscribe((value: Theme) => {
        localStorage.setItem('theme', value);
        document.documentElement.setAttribute('data-theme', value);
        updateFavicon(value);
    });
}

export function toggleTheme(): void {
    theme.update((current: Theme) => current === 'light' ? 'dark' : 'light');
}
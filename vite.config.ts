import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		fs: {
			// Restrict file serving to project root
			strict: true
		},
		watch: {
			// Ignore watching node_modules
			ignored: ['**/node_modules/**', '**/.git/**']
		}
	},
	optimizeDeps: {
		// Pre-bundle dependencies for faster cold starts
		include: ['svelte']
	}
});

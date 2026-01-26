import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [enhancedImages(),sveltekit()],
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

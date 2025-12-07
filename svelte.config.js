import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		files: {
			lib: 'src'  // Tell svelte-package that the library files are in src, not src/lib
		}
	}
};

export default config;
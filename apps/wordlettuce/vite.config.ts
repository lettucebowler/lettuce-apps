import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [tailwindcss(), sveltekit(), devtoolsJson()],
  build: {
    cssMinify: 'esbuild',
  },
};

export default config;

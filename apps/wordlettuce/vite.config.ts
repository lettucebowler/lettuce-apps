import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import type { UserConfig } from 'vite';

const config: UserConfig = {
  plugins: [tailwindcss(), sveltekit()],
  build: {
    assetsInlineLimit: 1024,
  },
};

export default config;

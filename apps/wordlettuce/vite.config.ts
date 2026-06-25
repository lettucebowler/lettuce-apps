import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import type { UserConfig } from 'vite';

import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import type { Config as SvelteConfig } from '@sveltejs/kit';

const svelteConfig: SvelteConfig = {
  preprocess: [vitePreprocess()],
    adapter: adapter(),
    experimental: {
      remoteFunctions: true,
      forkPreloads: true,
      handleRenderingErrors: true,
    },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

const config: UserConfig = {
  plugins: [tailwindcss(), sveltekit(svelteConfig), devtoolsJson()],
  build: {
    cssMinify: 'esbuild',
  },
};

export default config;

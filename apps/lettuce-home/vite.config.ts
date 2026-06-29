import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import contentCollections from '@content-collections/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';
import type { Config as SvelteConfig } from '@sveltejs/kit';

const svelteConfig: SvelteConfig = {
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['md'] })],
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  adapter: adapter(),
  experimental: {
    remoteFunctions: true,
    forkPreloads: true,
  },
  alias: {
    'content-collections': './.content-collections/generated',
  },
  extensions: ['.svelte', '.svx', '.md'],
};

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(svelteConfig), contentCollections()],
});

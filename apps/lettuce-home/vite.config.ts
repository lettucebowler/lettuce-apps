import tailwindcss from '@tailwindcss/vite';
import { Config, sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import contentCollections from '@content-collections/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-cloudflare';
import { mdsvex } from 'mdsvex';

const svelteConfig: Config = {
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['md'] })],
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
  adapter: adapter(),
  extensions: ['.svelte', '.svx', '.md'],
};

export default defineConfig({
  plugins: [tailwindcss(), enhancedImages(), sveltekit(svelteConfig), contentCollections()],
});

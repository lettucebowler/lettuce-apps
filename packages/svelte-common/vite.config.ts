import tailwindcss from '@tailwindcss/vite';
import { sveltekit, type Config } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import adapter from '@sveltejs/adapter-auto';

const svelteConfig: Config = {
  preprocess: vitePreprocess(),
  adapter: adapter(),
};

export default defineConfig({
  plugins: [sveltekit(svelteConfig), tailwindcss()],
});

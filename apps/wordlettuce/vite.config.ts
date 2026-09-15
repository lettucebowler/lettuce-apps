import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import devtoolsJson from 'vite-plugin-devtools-json';
import { defineConfig, searchForWorkspaceRoot } from 'vite';

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
    explicitEnvironmentVariables: true,
  },
  compilerOptions: {
    experimental: {
      async: true,
    },
  },
};

export default defineConfig({
  plugins: [tailwindcss(), sveltekit(svelteConfig), devtoolsJson()],
  build: {
    cssMinify: 'esbuild',
  },
  server: {
    fs: {
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },
});

import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  // Consult https://svelte.dev/docs/kit/integrations
  // for more information about preprocessors
  preprocess: [vitePreprocess(), mdsvex({ extensions: ['md'] })],
  compilerOptions: {
    experimental: {
      async: true
    }
  },

  kit: {
    adapter: adapter(),
    experimental: {
      remoteFunctions: true
    },
    alias: {
      'content-collections': './.content-collections/generated'
    }
  },
  extensions: ['.svelte', '.svx', '.md']
};

export default config;

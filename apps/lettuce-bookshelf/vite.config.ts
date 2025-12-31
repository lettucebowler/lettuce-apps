import devtoolsJson from 'vite-plugin-devtools-json';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import ViteYAML from '@modyfi/vite-plugin-yaml';

export default defineConfig({ plugins: [tailwindcss(), sveltekit(), devtoolsJson(), ViteYAML()] });

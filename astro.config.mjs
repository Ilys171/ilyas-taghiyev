// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  // TODO: replace with the final domain once it is connected in Vercel.
  site: 'https://ilyas-taghiyev.vercel.app',
  output: 'static',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
});

// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Project pages that no longer exist. Old links land on the projects list. */
const removedProjects = [
  'numbers-club',
  'science-club',
  'stem-van-thuis',
  'click',
  'school-voice',
  'loomlock',
  'wolbacaspian',
  'azerbaijan-childrens-foundation',
];

export default defineConfig({
  site: 'https://ilyastaghiyev.site',
  output: 'static',
  integrations: [
    sitemap({
      filter: (page) => !removedProjects.some((slug) => page.includes(`/projects/${slug}`)),
    }),
  ],
  redirects: Object.fromEntries(removedProjects.map((slug) => [`/projects/${slug}`, '/#projects'])),
});

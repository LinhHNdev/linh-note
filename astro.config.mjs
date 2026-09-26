// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkWikilinks from './src/plugins/remark-wikilinks.mjs';

// https://astro.build/config
export default defineConfig({
	markdown: {
		processor: unified({ remarkPlugins: [remarkWikilinks] }),
	},
});

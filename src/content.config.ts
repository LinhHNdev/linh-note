import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const notes = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
	schema: z.object({
		title: z.string(),
		tags: z.array(z.string()).default([]),
		stage: z.enum(['Seedling', 'Incubating', 'Evergreen']).default('Seedling'),
	}),
});

export const collections = { notes };

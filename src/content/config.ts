import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    author: z.string().default('Timo'),
    canonicalUrl: z.url().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = { blog };

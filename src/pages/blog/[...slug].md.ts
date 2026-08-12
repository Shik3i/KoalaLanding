import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';

type BlogProps = { entry: CollectionEntry<'blog'> };

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.id }, props: { entry },
  }));
}

export const GET: APIRoute<BlogProps> = async ({ props }) => {
  return new Response(props.entry.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};

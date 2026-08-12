import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import { locales } from '../../../i18n/config';

type BlogProps = { entry: CollectionEntry<'blog'> };

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  const activeLocales = locales.filter(l => l !== 'en');
  
  return activeLocales.flatMap((locale) => 
    blogEntries.map(entry => ({
      params: { locale, slug: entry.id },
      props: { entry },
    }))
  );
}

export const GET: APIRoute<BlogProps> = async ({ props }) => {
  return new Response(props.entry.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};

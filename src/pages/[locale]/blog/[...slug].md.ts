import { getCollection } from 'astro:content';
import { locales } from '../../../i18n/config';

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

export async function GET({ props }) {
  return new Response(props.entry.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

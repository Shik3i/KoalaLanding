import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { slug: entry.id }, props: { entry },
  }));
}

export async function GET({ props }) {
  return new Response(props.entry.body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { APIRoute } from 'astro';
import satori from 'satori';
import { html } from 'satori-html';
import { Resvg } from '@resvg/resvg-js';
import fs from 'node:fs';
import path from 'node:path';

type OgProps = { post: CollectionEntry<'blog'> };

export async function getStaticPaths() {
  const posts = await getCollection('blog');
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
}

export const GET: APIRoute<OgProps> = async ({ props }) => {
  const { post } = props;

  // Load fonts
  const interRegularPath = path.resolve(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-400-normal.woff');
  const interBoldPath = path.resolve(process.cwd(), 'node_modules/@fontsource/inter/files/inter-latin-700-normal.woff');
  const interRegular = fs.readFileSync(interRegularPath);
  const interBold = fs.readFileSync(interBoldPath);

  // Load logo
  const koalaLogoPath = path.resolve(process.cwd(), 'src/assets/brand/koalastuff-logo-512.png');
  const koalaLogoBuffer = fs.readFileSync(koalaLogoPath);
  const koalaLogoBase64 = `data:image/png;base64,${koalaLogoBuffer.toString('base64')}`;

  const description = post.data.description || '';
  const truncatedDesc = description.length > 130 ? description.slice(0, 130) + '...' : description;
  const dateStr = post.data.pubDate ? post.data.pubDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
  const authorStr = post.data.author || 'Timo';

  const markup = html`
    <div style="display: flex; flex-direction: column; width: 1200px; height: 630px; background-color: #0b0c10; padding: 80px; font-family: 'Inter';">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 60px;">
        <div style="display: flex; align-items: center;">
          <img src="${koalaLogoBase64}" style="width: 80px; height: 80px; border-radius: 50%; border: 4px solid #56ae6c;" />
          <span style="display: flex; font-size: 32px; font-weight: 700; color: #56ae6c; margin-left: 24px; letter-spacing: -1px;">KoalaStuff Blog</span>
        </div>
        <span style="display: flex; font-size: 28px; color: #c5c6c7;">${authorStr}</span>
      </div>
      <div style="display: flex; flex-grow: 1; flex-direction: column; justify-content: center;">
        <h1 style="display: flex; font-size: 72px; font-weight: 700; color: #ffffff; line-height: 1.1; margin: 0; letter-spacing: -2px;">
          ${post.data.title}
        </h1>
        <p style="display: flex; font-size: 36px; color: #c5c6c7; margin-top: 32px; line-height: 1.4;">${truncatedDesc}</p>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end;">
        <div style="display: flex; align-items: center;">
          <div style="display: flex; width: 24px; height: 24px; border-radius: 50%; background-color: #56ae6c; margin-right: 16px;"></div>
          <span style="display: flex; font-size: 28px; color: #56ae6c; font-weight: 600;">koalastuff.net</span>
        </div>
        <span style="display: flex; font-size: 28px; color: #c5c6c7;">
          ${dateStr}
        </span>
      </div>
    </div>
  `;

  const svg = await satori(markup, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: interBold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  });

  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(new Uint8Array(pngBuffer), {
    headers: {
      'Content-Type': 'image/png',
    },
  });
};

import type { APIRoute } from 'astro';
import { getListedProjects, getProjectDescription, getProjectSlug } from '../data/projects';

export const prerender = true;

const siteUrl = 'https://koalastuff.net';

export const GET: APIRoute = () => {
  const projects = getListedProjects();
  const sections = projects.map((project) => {
    const links = [
      `- Project page: ${siteUrl}/projects/${getProjectSlug(project)}/`,
      project.links.website && `- Website: ${project.links.website}`,
      project.links.github && `- GitHub: ${project.links.github}`,
      project.links.chrome && `- Chrome Web Store: ${project.links.chrome}`,
      project.links.firefox && `- Firefox Add-ons: ${project.links.firefox}`,
    ].filter(Boolean);

    const description = getProjectDescription(project, 'en', true);
    const backstory = project.backstory?.en;

    return [
      `## ${project.name}`,
      '',
      description,
      '',
      backstory && '### Why it exists',
      backstory && '',
      backstory,
      backstory && '',
      '### Project profile',
      '',
      `- Category: ${project.category}`,
      `- Lifecycle status: ${project.status}`,
      project.lastUpdated && `- Catalog updated: ${project.lastUpdated}`,
      `- Technologies and focus: ${project.tags.join(', ')}`,
      ...links,
    ].filter((line): line is string => typeof line === 'string').join('\n');
  });

  const body = [
    '# KoalaStuff',
    '',
    '> Small open-source tools for real annoyances. Browser extensions, web tools, desktop utilities and experiments developed by Timo.',
    '',
    'KoalaStuff is the central project hub for a growing collection of independent open-source software. The projects focus on privacy, local-first workflows, self-hosting, useful automation and small problems that are underserved by commercial software.',
    '',
    'This document describes the complete public project catalog. It is generated from `src/data/projects.ts`, so project pages, structured metadata and this machine-readable overview stay synchronized.',
    '',
    '## Quick fit assessment',
    '',
    'KoalaStuff is a good fit for people who:',
    '',
    '- prefer open-source tools that can be inspected and self-hosted',
    '- want local-first or privacy-conscious alternatives to account-heavy SaaS products',
    '- use browser extensions, small web applications and desktop utilities to remove workflow friction',
    '- accept that experimental and early projects may change quickly',
    '',
    'KoalaStuff is not a single bundled product, hosted account platform or commercial software suite. Each project has its own scope, maturity, installation path and repository.',
    '',
    '## Project lifecycle',
    '',
    '- `active`: usable and actively maintained',
    '- `early`: functional early-stage software whose interfaces or architecture may still change',
    '- `wip`: work in progress; download and production links may intentionally be hidden',
    '- `experimental`: a proof of concept or narrowly scoped experiment',
    '- `archived`: retained for reference but no longer actively developed',
    '',
    '## Privacy and licensing',
    '',
    '- The hub itself has no advertising, analytics, tracking pixels or third-party telemetry.',
    '- Most projects are designed around local processing, self-hosting or minimal data collection.',
    '- Exact privacy behavior, permissions and licenses are documented in each project repository.',
    '- A project appearing in this catalog does not imply that every project has identical capabilities, maturity or deployment requirements.',
    '',
    '## Main links',
    `- Website: ${siteUrl}`,
    '- GitHub: https://github.com/Shik3i',
    '- Blog: https://koalastuff.net/blog/',
    '- RSS: https://koalastuff.net/rss.xml',
    '- Mastodon: https://mastodon.social/@koalastuff',
    '- Support: https://ko-fi.com/koaladev',
    '',
    `# Complete project catalog (${projects.length} projects)`,
    '',
    ...sections.flatMap((section) => [section, '']),
  ].join('\n');

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

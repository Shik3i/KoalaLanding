import fs from 'node:fs/promises';

const source = await fs.readFile('src/data/projects.ts', 'utf8');
const catalogRepos = new Set(
  [...source.matchAll(/https:\/\/github\.com\/Shik3i\/([A-Za-z0-9_.-]+)/g)].map((match) => match[1].toLowerCase()),
);

const ignoredRepos = new Set([
  'koalalanding',
  'javascriptsammlung',
  'lf6',
  'shik3i',
  'tuttasesp32',
]);

const headers = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'KoalaLanding-catalog-audit',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {}),
};

const response = await fetch('https://api.github.com/users/Shik3i/repos?per_page=100&sort=updated', { headers });
if (!response.ok) {
  throw new Error(`GitHub catalog request failed: ${response.status} ${response.statusText}`);
}

const repos = await response.json();
const missing = repos
  .filter((repo) => !repo.fork && !repo.archived && repo.size > 0)
  .filter((repo) => !ignoredRepos.has(repo.name.toLowerCase()))
  .filter((repo) => !catalogRepos.has(repo.name.toLowerCase()))
  .map((repo) => repo.name)
  .sort();

if (missing.length > 0) {
  console.error(`Project catalog is missing public repositories: ${missing.join(', ')}`);
  process.exit(1);
}

console.log(`Project catalog audit passed (${catalogRepos.size} repositories represented).`);

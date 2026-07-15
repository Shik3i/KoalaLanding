import { execFileSync } from 'node:child_process';

function git(args: string[]): string | undefined {
  try {
    return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return undefined;
  }
}

const sourceDate = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000)
  : new Date(git(['show', '-s', '--format=%cI', 'HEAD']) ?? 0);

export const buildDate = Number.isNaN(sourceDate.valueOf())
  ? '1970-01-01'
  : sourceDate.toISOString().slice(0, 10);
export const buildYear = buildDate.slice(0, 4);

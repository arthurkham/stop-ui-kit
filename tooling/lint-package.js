// Validates a package exactly as it will be published: `pnpm pack` applies `publishConfig`
// and replaces `workspace:` ranges, then publint and attw inspect the resulting tarball.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });

const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
const exportsMap = pkg.publishConfig?.exports ?? pkg.exports ?? {};
// attw checks JavaScript and type entry points only; stylesheets and raw token files are assets.
const assetEntrypoints = Object.keys(exportsMap).filter((key) => /\.(css|json)$|\*/.test(key));

const packDir = mkdtempSync(join(tmpdir(), 'stop-ui-pack-'));

try {
  run('pnpm', ['pack', '--pack-destination', packDir]);
  const tarball = join(packDir, readdirSync(packDir)[0]);
  run('publint', ['--strict', tarball]);
  run('attw', [
    tarball,
    '--profile',
    'esm-only',
    ...(assetEntrypoints.length > 0 ? ['--exclude-entrypoints', ...assetEntrypoints] : []),
  ]);
} finally {
  rmSync(packDir, { recursive: true, force: true });
}

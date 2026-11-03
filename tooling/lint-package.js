// Validates a package exactly as it will be published: `pnpm pack` applies `publishConfig`
// and replaces `workspace:` ranges, then publint and attw inspect the resulting tarball.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const run = (command, args) => execFileSync(command, args, { stdio: 'inherit' });
const packDir = mkdtempSync(join(tmpdir(), 'stop-ui-pack-'));

try {
  run('pnpm', ['pack', '--pack-destination', packDir]);
  const tarball = join(packDir, readdirSync(packDir)[0]);
  run('publint', ['--strict', tarball]);
  run('attw', [tarball, '--profile', 'esm-only', '--exclude-entrypoints', './styles.css']);
} finally {
  rmSync(packDir, { recursive: true, force: true });
}

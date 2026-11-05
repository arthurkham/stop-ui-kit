// Snapshot of the public API that applications build on (see "Safe updates" in the README).
//
// - `api/<package>.d.ts`: the published type declarations of every package, without comments.
//   Covers exports, component props and `createButton` options.
// - `api/css.json`: what applications use from CSS: stylesheet entry points, CSS custom
//   properties they may set (tokens, component tokens, tone variables), styling hooks
//   (data attributes rendered by components) and theme names.
//
// Any change to the public API fails this check until the snapshot is updated with
// `pnpm api:update` and committed, so every change is visible in review. Removing or renaming
// something is a breaking change: note it in the changeset and keep an alias where possible.
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const API_DIR = 'api';
const packages = ['tokens', 'core', 'styles', 'react'];
const update = process.argv.includes('--update');
const errors = [];

/** All files below a directory, recursively, sorted. */
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
    )
    .sort();

const read = (file) => readFileSync(file, 'utf8');

/** Published declarations of one package, without comments, in one file. */
const declarations = (name) => {
  const dist = join('packages', name, 'dist');
  if (!existsSync(dist)) throw new Error(`${dist} is missing. Run "pnpm build" first.`);
  return walk(dist)
    .filter((file) => file.endsWith('.d.ts'))
    .map((file) => {
      const body = read(file)
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/^\s*\/\/.*$/gm, '')
        .replace(/^[ \t]+$/gm, '')
        .replace(/\n{2,}/g, '\n')
        .trim();
      return `// ${relative(dist, file)}\n${body}\n`;
    })
    .join('\n');
};

const unique = (values) => [...new Set(values)].sort();

/** Public custom properties: single-dash `--sui-*` names (double dashes mark internals). */
const isPublicProperty = (name) => /^--sui-[a-z0-9]+(-[a-z0-9]+)*$/.test(name);

const tokensCss = read('packages/tokens/dist/tokens.css');
const componentsCss = read('packages/tokens/dist/components.css');
const reactJs = walk('packages/react/dist')
  .filter((file) => file.endsWith('.js'))
  .map(read)
  .join('\n');
const exportsOf = (name) => {
  const pkg = JSON.parse(read(join('packages', name, 'package.json')));
  return Object.keys(pkg.publishConfig?.exports ?? pkg.exports);
};

const css = {
  stylesheets: unique(
    ['styles', 'react', 'tokens'].flatMap((name) =>
      exportsOf(name)
        .filter((entry) => entry.endsWith('.css'))
        .map((entry) => `@stop-ui/${name}${entry.slice(1)}`),
    ),
  ),
  customProperties: unique(
    [
      // Tokens declared by the kit.
      ...[...tokensCss.matchAll(/(--sui-[\w-]+)\s*:/g)].map((match) => match[1]),
      // Tone variables declared for styling hooks and custom shapes.
      ...[...componentsCss.matchAll(/(--sui-[\w-]+)\s*:/g)].map((match) => match[1]),
      // Component tokens: never declared, read with a fallback.
      ...[...componentsCss.matchAll(/var\((--sui-[\w-]+),/g)].map((match) => match[1]),
    ].filter(isPublicProperty),
  ),
  stylingHooks: unique([...reactJs.matchAll(/"(data-[a-z-]+)"/g)].map((match) => match[1])),
  themes: unique(
    [...tokensCss.matchAll(/\[data-sui-theme=['"]?([a-z]+)['"]?\]/g)].map((m) => m[1]),
  ),
};

const snapshots = {
  ...Object.fromEntries(packages.map((name) => [`${name}.d.ts`, declarations(name)])),
  'css.json': `${JSON.stringify(css, null, 2)}\n`,
};

/** Lines only in `before` or only in `after`, for a readable summary of the change. */
const lineDiff = (before, after) => {
  const a = new Set(before.split('\n').map((line) => line.trim()));
  const b = new Set(after.split('\n').map((line) => line.trim()));
  const removed = [...a].filter((line) => line && !b.has(line) && !line.startsWith('//'));
  const added = [...b].filter((line) => line && !a.has(line) && !line.startsWith('//'));
  return { removed, added };
};

if (update) mkdirSync(API_DIR, { recursive: true });

for (const [file, content] of Object.entries(snapshots)) {
  const path = join(API_DIR, file);
  if (update) {
    writeFileSync(path, content);
    continue;
  }
  if (!existsSync(path)) {
    errors.push(`Missing ${path}.`);
    continue;
  }
  const current = read(path);
  if (current === content) continue;
  const { removed, added } = lineDiff(current, content);
  errors.push(
    [
      `${path} changed:`,
      ...removed.map((line) => `    - ${line}`),
      ...added.map((line) => `    + ${line}`),
    ].join('\n'),
  );
}

if (update) {
  console.log(`Updated the public API snapshot in ${API_DIR}/.`);
} else if (errors.length > 0) {
  console.error(
    [
      'Public API check failed:',
      ...errors.map((error) => `  ${error}`),
      '',
      'If the change is intended, run "pnpm api:update" and commit the snapshot.',
      'Removing or renaming public API is a breaking change: mark it as Breaking in the changeset,',
      'describe the migration, and keep the old name working where possible (see "Safe updates").',
    ].join('\n'),
  );
  process.exit(1);
} else {
  console.log('Public API check passed.');
}

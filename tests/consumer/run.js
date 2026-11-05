// Consumer test: installs the packed packages into a fresh application, exactly as npm users get
// them, and checks in a real browser that the kit works next to other CSS and can be customized.
//
// 1. Packs every package (publishConfig applied) into a temporary directory.
// 2. Copies ./app there and installs the tarballs with npm, outside the workspace.
// 3. Type-checks the app against the published declarations and builds it with Vite.
// 4. Opens every page in Chromium:
//    - host pages (Tailwind; an existing site with untouched Bootstrap 3 and global CSS, in
//      several load orders; the layered stylesheet) must render the components exactly like
//      the page with only the isolated stylesheet, so no host CSS leaks in;
//    - `data-expect` / `data-expect-focus` attributes list computed styles to verify, such as
//      customization results or Bootstrap's `.hidden` still hiding kit components.
//
// Usage: `pnpm build && pnpm test:consumer` (requires `pnpm exec playwright install chromium`).
// Set KEEP=1 to keep the temporary directory for debugging.
import { execFileSync } from 'node:child_process';
import {
  cpSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(import.meta.dirname, '../..');
const packages = ['tokens', 'core', 'styles', 'react'];

const run = (command, args, cwd, { quiet = false } = {}) => {
  execFileSync(command, args, { cwd, stdio: ['ignore', quiet ? 'ignore' : 'inherit', 'inherit'] });
};

const step = (message) => {
  console.log(`\n▶ ${message}`);
};

for (const name of packages) {
  if (!existsSync(join(root, 'packages', name, 'dist'))) {
    console.error(`packages/${name}/dist is missing. Run "pnpm build" first.`);
    process.exit(1);
  }
}

const workDir = mkdtempSync(join(tmpdir(), 'stop-ui-consumer-'));
const packsDir = join(workDir, 'packs');
const appDir = join(workDir, 'app');

step('Packing packages');
for (const name of packages) {
  run('pnpm', ['pack', '--pack-destination', packsDir], join(root, 'packages', name), {
    quiet: true,
  });
}
const tarball = (name) => {
  const file = readdirSync(packsDir).find((entry) => entry.startsWith(`stop-ui-${name}-`));
  if (!file) throw new Error(`No tarball for @stop-ui/${name}`);
  return `file:${join(packsDir, file)}`;
};

step('Installing them into a fresh application');
cpSync(join(import.meta.dirname, 'app'), appDir, { recursive: true });
const manifestPath = join(appDir, 'package.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.dependencies['@stop-ui/react'] = tarball('react');
// The token preset is imported directly, so the app installs the package itself.
manifest.devDependencies['@stop-ui/tokens'] = tarball('tokens');
// Internal dependencies resolve to the local tarballs instead of the registry.
manifest.overrides = Object.fromEntries(
  packages.map((name) => [`@stop-ui/${name}`, tarball(name)]),
);
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
run('npm', ['install', '--no-audit', '--no-fund', '--loglevel=error'], appDir);

step('Type-checking against the published declarations');
run('npx', ['tsc', '--noEmit'], appDir);

step('Building with Vite');
run('npx', ['vite', 'build', '--logLevel', 'warn'], appDir);

step('Checking pages in Chromium');
const distDir = join(appDir, 'dist');
const contentTypes = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
const server = createServer((request, response) => {
  const path = join(distDir, new URL(request.url ?? '/', 'http://localhost').pathname);
  if (!path.startsWith(distDir) || !existsSync(path)) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, {
    'Content-Type': contentTypes[extname(path)] ?? 'application/octet-stream',
  });
  response.end(readFileSync(path));
});
await new Promise((done) => server.listen(0, '127.0.0.1', () => done(undefined)));
const address = server.address();
const origin = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`;

// Computed styles that host CSS commonly changes. `width` and `height` cover box-sizing, which
// on its own makes no difference for elements without padding or borders.
const properties = [
  'display',
  'width',
  'height',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'border-top-width',
  'border-top-style',
  'border-top-color',
  'border-top-left-radius',
  'font-family',
  'font-size',
  'font-weight',
  'font-style',
  'line-height',
  'letter-spacing',
  'text-transform',
  'text-decoration-line',
  'text-align',
  'vertical-align',
  'color',
  'background-color',
  'background-image',
  'box-shadow',
  'opacity',
  'cursor',
];

/** Computed styles of every element inside the kitchen sink, in document order. */
const snapshotKitchen = (props) =>
  Array.from(document.querySelectorAll('[data-kitchen] *'))
    .filter((element) => !(element instanceof SVGElement) && element.tagName !== 'OPTION')
    .map((element) => {
      const style = getComputedStyle(element);
      const text = element.textContent?.trim().slice(0, 20);
      return {
        name: `<${element.tagName.toLowerCase()}>${text ? ` "${text}"` : ''}`,
        style: Object.fromEntries(props.map((prop) => [prop, style.getPropertyValue(prop)])),
      };
    });

const failures = [];
const browser = await chromium.launch();
// Reduced motion disables transitions, so styles are read in their final state.
const context = await browser.newContext({ reducedMotion: 'reduce' });
const page = await context.newPage();
page.on('pageerror', (error) => failures.push(`${page.url()}: ${error.message}`));

const open = async (name) => {
  await page.goto(`${origin}/${name}.html`);
  await page.waitForSelector('#root > *');
};

const parseDeclarations = (text) =>
  text
    .split(';')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const index = part.indexOf(':');
      return [part.slice(0, index).trim(), part.slice(index + 1).trim()];
    });

const checkExpectations = async (name) => {
  for (const [attribute, focus] of [
    ['data-expect', false],
    ['data-expect-focus', true],
  ]) {
    const elements = await page.locator(`[${attribute}]`).all();
    for (const element of elements) {
      if (focus) {
        // Keyboard focus, so :focus-visible applies as it does for keyboard users.
        for (let presses = 0; presses < 100; presses += 1) {
          if (await element.evaluate((node) => node === document.activeElement)) break;
          await page.keyboard.press('Tab');
        }
      }
      const label =
        (await element.getAttribute('aria-label')) ?? (await element.textContent())?.trim();
      const expected = parseDeclarations((await element.getAttribute(attribute)) ?? '');
      const actual = await element.evaluate(
        (node, props) => props.map((prop) => getComputedStyle(node).getPropertyValue(prop)),
        expected.map(([prop]) => prop),
      );
      expected.forEach(([prop, value], index) => {
        if (actual[index] !== value) {
          failures.push(
            `${name}: "${label}"${focus ? ' (focused)' : ''} ${prop} is ${actual[index]}, expected ${value}`,
          );
        }
      });
    }
  }
};

const pages = readdirSync(appDir)
  .filter((file) => file.endsWith('.html'))
  .map((file) => file.replace(/\.html$/, ''));

await open('bare');
const baseline = await page.evaluate(snapshotKitchen, properties);
let checkedPages = 0;

for (const name of pages) {
  await open(name);
  checkedPages += 1;
  await checkExpectations(name);
  if (name === 'bare' || !(await page.locator('[data-kitchen]').count())) continue;

  const host = await page.evaluate(snapshotKitchen, properties);
  if (host.length !== baseline.length) {
    failures.push(`${name}: rendered ${host.length} elements, expected ${baseline.length}`);
    continue;
  }
  host.forEach((element, index) => {
    const expected = baseline[index];
    for (const prop of properties) {
      // The style and color of a missing border are invisible.
      const noBorder =
        expected.style['border-top-width'] === '0px' && element.style['border-top-width'] === '0px';
      if (noBorder && (prop === 'border-top-style' || prop === 'border-top-color')) continue;
      if (element.style[prop] !== expected.style[prop]) {
        failures.push(
          `${name}: ${expected.name} ${prop} is ${element.style[prop]}, expected ${expected.style[prop]} (host CSS leaked in)`,
        );
      }
    }
  });
}

await browser.close();
server.close();
if (process.env.KEEP) console.log(`\nKept ${workDir}`);
else rmSync(workDir, { recursive: true, force: true });

if (failures.length > 0) {
  console.error(`\n✖ Consumer test failed (${failures.length}):\n  ${failures.join('\n  ')}`);
  process.exit(1);
}
console.log(`\n✔ Consumer test passed: ${checkedPages} pages.`);

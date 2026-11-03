// Verifies the compiled stylesheet that every application ships.
//
// Invariants: the guarantees the kit makes to host applications (see docs/quality.md).
// Snapshot:   any change to the generated CSS (e.g. after a Tailwind update) shows up as a diff
//             that has to be reviewed and committed with `pnpm css:update`.
import { readFileSync, writeFileSync } from 'node:fs';
import postcss from 'postcss';

const STYLESHEET = 'packages/styles/dist/styles.css';
const COPY = 'packages/react/dist/styles.css';
const SNAPSHOT = 'packages/styles/snapshots/styles.css';

const css = readFileSync(STYLESHEET, 'utf8');
const root = postcss.parse(css);
const errors = [];

const layerOf = (node) => {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer') return parent.params;
  }
  return null;
};

// 1. Layers appear in the order hosts expect: theme < base < components < utilities.
//    (The order of first appearance defines cascade priority.)
const layerOrder = [];
root.walkAtRules('layer', (rule) => {
  for (const name of rule.params.split(',').map((part) => part.trim())) {
    if (!layerOrder.includes(name)) layerOrder.push(name);
  }
});
const expected = ['theme', 'base', 'components', 'utilities'];
const actual = layerOrder.filter((name) => expected.includes(name));
if (actual.join() !== expected.join()) {
  errors.push(`Layer order is "${actual.join(', ')}", expected "${expected.join(', ')}".`);
}

root.walkRules((rule) => {
  const layer = layerOf(rule);
  if (rule.parent?.type === 'atrule' && rule.parent.name === 'keyframes') return;

  for (const selector of rule.selectors) {
    const classes = selector.match(/\.(?:\\.|[\w-])+/g) ?? [];

    // 2. Every class name is prefixed, so kit classes never collide with application classes.
    for (const name of classes) {
      if (!name.startsWith('.sui\\:')) errors.push(`Unprefixed class "${name}" in "${selector}".`);
    }

    // 3. Kit utilities live in the components layer, below application utilities.
    if (classes.length > 0 && layer !== 'components') {
      errors.push(
        `Utility "${selector}" is in layer "${layer ?? 'none'}" instead of "components".`,
      );
    }

    // 4. No global resets: selectors without a class or attribute only appear where Tailwind
    //    registers its internal variables (properties layer) or tokens are declared.
    const targetsElements = classes.length === 0 && !selector.includes('[');
    const allowed =
      (layer === 'properties' &&
        /^(\*|:{1,2}before|:{1,2}after|::backdrop)$/.test(selector.trim())) ||
      ((layer === 'theme' || layer === 'components') && /^(:root|:host)$/.test(selector.trim()));
    if (targetsElements && !allowed) {
      errors.push(
        `Global selector "${selector}" in layer "${layer ?? 'none'}" would restyle the host page.`,
      );
    }
  }
});

// 5. Only kit and Tailwind-internal custom properties are declared.
root.walkDecls((decl) => {
  if (decl.prop.startsWith('--') && !/^--(sui|tw)-/.test(decl.prop)) {
    errors.push(`Custom property "${decl.prop}" is not namespaced with --sui- or --tw-.`);
  }
});

// 6. The React package ships the same stylesheet.
if (readFileSync(COPY, 'utf8') !== css) {
  errors.push(`${COPY} differs from ${STYLESHEET}.`);
}

if (process.argv.includes('--update')) {
  writeFileSync(SNAPSHOT, css);
  console.log(`Updated ${SNAPSHOT}.`);
} else {
  let snapshot = '';
  try {
    snapshot = readFileSync(SNAPSHOT, 'utf8');
  } catch {
    errors.push(`Missing ${SNAPSHOT}. Run "pnpm css:update".`);
  }
  if (snapshot && snapshot !== css) {
    errors.push(
      `The compiled CSS changed. Review "git diff ${SNAPSHOT}" after running "pnpm css:update", ` +
        'and commit the snapshot if the change is intended.',
    );
  }
}

if (errors.length > 0) {
  console.error(`CSS check failed:\n${errors.map((error) => `  - ${error}`).join('\n')}`);
  process.exit(1);
}
console.log('CSS check passed.');

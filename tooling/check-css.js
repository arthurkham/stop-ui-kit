// Verifies the compiled stylesheets that applications ship.
//
// - `styles.layer.css`: kit styles in the `components` cascade layer.
// - `styles.css`: the isolated default, derived from the layered one (see tooling/isolate-css.ts).
//
// Invariants: the guarantees the kit makes to host applications (see docs/quality.md).
// Snapshot:   any change to the generated CSS (e.g. after a Tailwind update) shows up as a diff
//             that has to be reviewed and committed with `pnpm css:update`. The isolated
//             stylesheet is checked to be exactly the transform of the snapshotted layered one.
import { readFileSync, writeFileSync } from 'node:fs';
import postcss from 'postcss';
import { isolateStyles, SHIELD } from './isolate-css.ts';

const DIST = 'packages/styles/dist';
const REACT_DIST = 'packages/react/dist';
const SNAPSHOT = 'packages/styles/snapshots/styles.layer.css';

const errors = [];

const layerOf = (node) => {
  for (let parent = node.parent; parent; parent = parent.parent) {
    if (parent.type === 'atrule' && parent.name === 'layer') return parent.params;
  }
  return null;
};

/** Order in which layers first appear, which defines their cascade priority. */
const layerOrder = (root) => {
  const order = [];
  root.walkAtRules('layer', (rule) => {
    for (const name of rule.params.split(',').map((part) => part.trim())) {
      if (!order.includes(name)) order.push(name);
    }
  });
  return order;
};

/**
 * @param {string} file
 * @param {'layered' | 'isolated'} kind
 */
const checkStylesheet = (file, kind) => {
  const css = readFileSync(`${DIST}/${file}`, 'utf8');
  const root = postcss.parse(css);
  const fail = (message) => errors.push(`${file}: ${message}`);

  // 1. Layers appear in the order hosts expect: theme < base < components < utilities.
  //    The isolated stylesheet has no components layer: kit styles are unlayered.
  const expected =
    kind === 'layered'
      ? ['theme', 'base', 'components', 'utilities']
      : ['theme', 'base', 'utilities'];
  const actual = layerOrder(root).filter((name) =>
    ['theme', 'base', 'components', 'utilities'].includes(name),
  );
  if (actual.join() !== expected.join()) {
    fail(`layer order is "${actual.join(', ')}", expected "${expected.join(', ')}".`);
  }

  root.walkRules((rule) => {
    const layer = layerOf(rule);
    if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;

    for (const selector of rule.selectors) {
      const classes = selector.match(/\.(?:\\.|[\w-])+/g) ?? [];

      // 2. Every class name is prefixed, so kit classes never collide with application classes.
      for (const name of classes) {
        if (!name.startsWith('.sui\\:')) fail(`unprefixed class "${name}" in "${selector}".`);
      }

      // 3. Layered: kit utilities live in the components layer, below application utilities.
      //    Isolated: kit utilities are unlayered and carry the specificity shield, so host CSS
      //    without `!important` cannot override them.
      if (classes.length > 0) {
        if (kind === 'layered' && layer !== 'components') {
          fail(`utility "${selector}" is in layer "${layer ?? 'none'}" instead of "components".`);
        }
        if (kind === 'isolated' && (layer !== null || !selector.includes(SHIELD))) {
          fail(`utility "${selector}" is not unlayered with the specificity shield.`);
        }
      }

      // 4. No global resets: selectors without a class or attribute only appear where Tailwind
      //    registers its internal variables (properties layer) or tokens are declared.
      const targetsElements = classes.length === 0 && !selector.includes('[');
      const allowed =
        (layer === 'properties' &&
          /^(\*|:{1,2}before|:{1,2}after|::backdrop)$/.test(selector.trim())) ||
        (layer === 'theme' && /^(:root|:host)$/.test(selector.trim()));
      if (targetsElements && !allowed) {
        fail(`global selector "${selector}" in layer "${layer ?? 'none'}" would restyle the host.`);
      }
    }
  });

  // 5. Only kit and Tailwind-internal custom properties are declared.
  root.walkDecls((decl) => {
    if (decl.prop.startsWith('--') && !/^--(sui|tw)-/.test(decl.prop)) {
      fail(`custom property "${decl.prop}" is not namespaced with --sui- or --tw-.`);
    }
  });

  // 6. The React package ships the same stylesheet.
  if (readFileSync(`${REACT_DIST}/${file}`, 'utf8') !== css) {
    fail(`${REACT_DIST}/${file} differs from ${DIST}/${file}.`);
  }

  return css;
};

const layered = checkStylesheet('styles.layer.css', 'layered');
const isolated = checkStylesheet('styles.css', 'isolated');

// 7. The isolated stylesheet is exactly the transform of the layered one.
const derived = (await postcss([isolateStyles()]).process(layered, { from: undefined })).css;
if (derived !== isolated) {
  errors.push('styles.css is not the isolated transform of styles.layer.css. Rebuild the styles.');
}

if (process.argv.includes('--update')) {
  writeFileSync(SNAPSHOT, layered);
  console.log(`Updated ${SNAPSHOT}.`);
} else {
  let snapshot = '';
  try {
    snapshot = readFileSync(SNAPSHOT, 'utf8');
  } catch {
    errors.push(`Missing ${SNAPSHOT}. Run "pnpm css:update".`);
  }
  if (snapshot && snapshot !== layered) {
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

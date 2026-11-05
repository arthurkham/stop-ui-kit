// Turns the layered stylesheet into the isolated one that `@stop-ui/styles/styles.css` ships.
//
// Unlayered CSS always beats layered CSS, so in an existing site (Bootstrap 3, normalize.css,
// the site's own global element styles) layered kit styles would lose to every host rule. The
// isolated stylesheet takes kit styles out of the `components` layer and raises every kit rule to
// the specificity of two ID selectors with `:not(#\#):not(#\#)`, which matches every element.
//
// - Host CSS without `!important` cannot override the kit, whatever its load order or selectors
//   (up to two IDs), so the host needs no changes and its own pages stay as they are.
// - Host `!important` and inline styles still win: Bootstrap's `.hidden` and jQuery's `.hide()`
//   keep working on kit components.
// - Applications customize through tokens (CSS variables never compete with selectors), or use
//   `!important` (Tailwind's `class!`) for one-off overrides. `styles.layer.css` is the layered
//   variant for applications without legacy global CSS.

import type { Plugin } from 'postcss';

/** Appended to every kit selector: two ID selectors that can never fail to match. */
export const SHIELD = ':not(#\\#):not(#\\#)';

/** A kit utility class, e.g. `.sui\:h-9`. */
const KIT_CLASS = /\.sui\\:/;
/** First pseudo-element (`::placeholder`), which must stay at the end of a selector. */
const PSEUDO_ELEMENT = /(?<!\\)::/;

export function shieldSelector(selector: string): string {
  if (!KIT_CLASS.test(selector) || selector.includes(SHIELD)) return selector;
  const match = PSEUDO_ELEMENT.exec(selector);
  return match
    ? selector.slice(0, match.index) + SHIELD + selector.slice(match.index)
    : selector + SHIELD;
}

/** PostCSS plugin that produces the isolated stylesheet from the layered one. */
export function isolateStyles(): Plugin {
  return {
    postcssPlugin: 'stop-ui-isolate-styles',
    OnceExit(root) {
      root.walkAtRules('layer', (layer) => {
        if (layer.params !== 'components' || !layer.nodes) return;
        layer.walkRules((rule) => {
          if (rule.parent?.type === 'atrule' && rule.parent.name.endsWith('keyframes')) return;
          rule.selectors = rule.selectors.map(shieldSelector);
        });
        layer.replaceWith(layer.nodes);
      });
    },
  };
}

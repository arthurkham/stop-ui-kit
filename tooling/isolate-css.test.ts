import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { isolateStyles, SHIELD, shieldSelector } from './isolate-css.js';

const isolate = async (css: string) =>
  (await postcss([isolateStyles()]).process(css, { from: undefined })).css;

describe('shieldSelector', () => {
  it('raises kit selectors to the specificity of two IDs', () => {
    expect(shieldSelector('.sui\\:h-9')).toBe(`.sui\\:h-9${SHIELD}`);
    expect(shieldSelector('.sui\\:hover\\:bg-x:hover')).toBe(`.sui\\:hover\\:bg-x:hover${SHIELD}`);
  });

  it('keeps pseudo-elements at the end of the selector', () => {
    expect(shieldSelector('.sui\\:placeholder\\:text-x::placeholder')).toBe(
      `.sui\\:placeholder\\:text-x${SHIELD}::placeholder`,
    );
  });

  it('leaves selectors without kit classes alone', () => {
    expect(shieldSelector('[data-sui-button][data-tone="primary"]')).toBe(
      '[data-sui-button][data-tone="primary"]',
    );
  });
});

describe('isolateStyles', () => {
  it('moves kit styles out of the components layer and shields them', async () => {
    const css = await isolate(
      '@layer theme { :root { --sui-x: 1px; } } @layer components { .sui\\:h-9 { height: 1px; } @media (hover: hover) { .sui\\:hover\\:x:hover { color: red; } } [data-sui-button] { --sui-tone: red; } }',
    );
    expect(css).toContain('@layer theme');
    expect(css).not.toContain('@layer components');
    expect(css).toContain(`.sui\\:h-9${SHIELD} { height: 1px; }`);
    expect(css).toContain(`.sui\\:hover\\:x:hover${SHIELD} { color: red; }`);
    expect(css).toContain('[data-sui-button] { --sui-tone: red; }');
  });

  it('leaves keyframes untouched', async () => {
    const css = await isolate('@layer components { @keyframes sui-spin { to { opacity: 0; } } }');
    expect(css).toContain('@keyframes sui-spin { to { opacity: 0; } }');
  });
});

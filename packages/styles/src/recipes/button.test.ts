import { extendTailwindMerge } from 'tailwind-merge';
import { describe, expect, it } from 'vitest';
import { buttonVariants } from './button.js';

// Used only here: proves that no combination of variants emits two utilities for the same CSS
// property, which is why the kit needs no runtime class merging.
const twMerge = extendTailwindMerge({ prefix: 'sui' });

const variants = ['solid', 'soft', 'outline', 'ghost'] as const;
const sizes = ['sm', 'md', 'lg'] as const;

describe('buttonVariants', () => {
  it('uses a checker that detects conflicts in the syntax the recipes use', () => {
    expect(twMerge('sui:bg-transparent sui:bg-(color:--sui-tone)')).toBe(
      'sui:bg-(color:--sui-tone)',
    );
    expect(twMerge('sui:border-transparent sui:border-(color:--sui-tone-border)')).toBe(
      'sui:border-(color:--sui-tone-border)',
    );
  });

  it.each(variants.flatMap((variant) => sizes.map((size) => [variant, size] as const)))(
    'has no conflicting classes for %s / %s',
    (variant, size) => {
      const classes = buttonVariants({ variant, size });
      expect(twMerge(classes)).toBe(classes);
    },
  );

  it('never hard-codes colors: shapes only read tone variables', () => {
    for (const variant of variants) {
      const colorClasses = buttonVariants({ variant })
        .split(' ')
        .filter((name) => /:(bg|text|border)-/.test(name) && !/border-solid$/.test(name));
      for (const name of colorClasses) {
        expect(name).toMatch(/\(color:--sui-tone[a-z-]*\)|-transparent$|text-(sm|base)$/);
      }
    }
  });
});

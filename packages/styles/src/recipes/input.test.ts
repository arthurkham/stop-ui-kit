import { extendTailwindMerge } from 'tailwind-merge';
import { describe, expect, it } from 'vitest';
import { inputGroupVariants, inputVariants, selectVariants, textareaVariants } from './input.js';

const twMerge = extendTailwindMerge({ prefix: 'sui' });
const sizes = ['sm', 'md', 'lg'] as const;

describe('form field recipes', () => {
  it.each(sizes.flatMap((size) => [true, false].map((grouped) => [size, grouped] as const)))(
    'input has no conflicting classes for %s / grouped=%s',
    (size, grouped) => {
      const classes = inputVariants({ size, grouped });
      expect(twMerge(classes)).toBe(classes);
    },
  );

  it.each(sizes.flatMap((size) => [true, false].map((autoResize) => [size, autoResize] as const)))(
    'textarea has no conflicting classes for %s / autoResize=%s',
    (size, autoResize) => {
      const classes = textareaVariants({ size, autoResize });
      expect(twMerge(classes)).toBe(classes);
    },
  );

  it.each(sizes)('select and input group have no conflicting classes for %s', (size) => {
    for (const classes of [selectVariants({ size }), inputGroupVariants({ size })]) {
      expect(twMerge(classes)).toBe(classes);
    }
  });

  it('uses logical properties only, so fields work in right-to-left layouts', () => {
    const all = sizes
      .flatMap((size) => [
        inputVariants({ size }),
        textareaVariants({ size }),
        selectVariants({ size }),
        inputGroupVariants({ size }),
      ])
      .join(' ');
    expect(all).not.toMatch(/:(pl|pr|ml|mr|left|right)-/);
  });
});

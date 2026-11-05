import { createButton } from '@stop-ui/react';

const tones = {
  success: {
    color: 'var(--app-success)',
    hover: 'var(--app-success-hover)',
    fg: 'var(--app-success-fg)',
  },
};

/**
 * The project's own Button, with a project tone, shapes and defaults. With the isolated
 * stylesheet, shape classes that replace kit styles use Tailwind's important modifier.
 */
export const Button = createButton({
  tones,
  variants: {
    pill: { extends: 'solid', className: 'rounded-[20px]! px-6!' },
    link: 'h-auto! p-0! bg-transparent! border-transparent! underline! text-(--sui-tone-text)!',
  },
  defaults: { size: 'sm' },
});

/** The same Button for an application that uses the layered stylesheet. */
export const LayerButton = createButton({
  tones,
  variants: {
    pill: { extends: 'solid', className: 'rounded-[20px] px-6' },
  },
  defaults: { size: 'sm' },
});

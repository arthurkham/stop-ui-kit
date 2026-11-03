import { cva, type VariantProps } from 'class-variance-authority';

/** Built-in color tones. Each one is bound to `--sui-button-<tone>*` tokens. */
export const buttonTones = ['primary', 'neutral', 'danger'] as const;
export type ButtonTone = (typeof buttonTones)[number];

/**
 * Button shapes. Colors never appear here: every shape reads the active tone through
 * `--sui-tone`, `--sui-tone-hover`, `--sui-tone-fg`, `--sui-tone-text` and the derived
 * `--sui-tone-soft`, `--sui-tone-soft-hover` and `--sui-tone-border` variables, so a new tone
 * works with every shape automatically.
 */
export const buttonVariants = cva(
  [
    // Layout. `box-border` and `m-0` are explicit because the kit ships without a CSS reset.
    'sui:box-border sui:m-0 sui:inline-flex sui:shrink-0 sui:items-center sui:justify-center sui:gap-2',
    // Every shape has a border; transparent ones keep the outline visible in forced-colors mode.
    'sui:rounded-md sui:border sui:border-solid',
    'sui:[font-family:inherit] sui:font-medium sui:whitespace-nowrap sui:normal-case sui:no-underline sui:select-none',
    'sui:cursor-pointer sui:transition-colors sui:motion-reduce:transition-none',
    // Focus indicator. `outline` survives forced-colors mode, unlike box-shadow rings.
    'sui:focus-visible:outline-2 sui:focus-visible:outline-solid sui:focus-visible:outline-offset-2 sui:focus-visible:outline-ring',
    'sui:disabled:cursor-not-allowed sui:disabled:opacity-50',
    'sui:aria-busy:cursor-progress',
  ],
  {
    variants: {
      variant: {
        solid:
          'sui:border-transparent sui:bg-(color:--sui-tone) sui:text-(color:--sui-tone-fg) sui:not-disabled:hover:bg-(color:--sui-tone-hover)',
        soft: 'sui:border-transparent sui:bg-(color:--sui-tone-soft) sui:text-(color:--sui-tone-text) sui:not-disabled:hover:bg-(color:--sui-tone-soft-hover)',
        outline:
          'sui:border-(color:--sui-tone-border) sui:bg-transparent sui:text-(color:--sui-tone-text) sui:not-disabled:hover:bg-(color:--sui-tone-soft)',
        ghost:
          'sui:border-transparent sui:bg-transparent sui:text-(color:--sui-tone-text) sui:not-disabled:hover:bg-(color:--sui-tone-soft)',
      },
      size: {
        sm: 'sui:h-8 sui:px-3 sui:text-sm',
        md: 'sui:h-9 sui:px-4 sui:text-sm',
        lg: 'sui:h-10 sui:px-5 sui:text-base',
      },
    },
    defaultVariants: {
      variant: 'solid',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
export type ButtonVariant = NonNullable<ButtonVariantProps['variant']>;
export type ButtonSize = NonNullable<ButtonVariantProps['size']>;

/** Classes for the loading spinner rendered inside a button. */
export const buttonSpinnerClassName =
  'sui:size-[1em] sui:animate-spin sui:motion-reduce:[animation-duration:1.5s]';

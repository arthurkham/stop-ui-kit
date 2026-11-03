import { cva, type VariantProps } from 'class-variance-authority';

export const buttonVariants = cva(
  [
    // Layout. `box-border` and `m-0` are explicit because the kit ships without a CSS reset.
    'sui:box-border sui:m-0 sui:inline-flex sui:shrink-0 sui:items-center sui:justify-center sui:gap-2',
    // A transparent border keeps the button outline visible in forced-colors mode.
    'sui:rounded-md sui:border sui:border-solid sui:border-transparent',
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
        primary: 'sui:bg-primary sui:text-primary-fg sui:not-disabled:hover:bg-primary-hover',
        secondary:
          'sui:bg-secondary sui:text-secondary-fg sui:not-disabled:hover:bg-secondary-hover',
        outline:
          'sui:border-border-strong sui:bg-transparent sui:text-fg sui:not-disabled:hover:bg-secondary',
        ghost: 'sui:bg-transparent sui:text-fg sui:not-disabled:hover:bg-secondary',
        danger: 'sui:bg-danger sui:text-danger-fg sui:not-disabled:hover:bg-danger-hover',
      },
      size: {
        sm: 'sui:h-8 sui:px-3 sui:text-sm',
        md: 'sui:h-9 sui:px-4 sui:text-sm',
        lg: 'sui:h-10 sui:px-5 sui:text-base',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;

/** Classes for the loading spinner rendered inside a button. */
export const buttonSpinnerClassName =
  'sui:size-[1em] sui:animate-spin sui:motion-reduce:[animation-duration:1.5s]';

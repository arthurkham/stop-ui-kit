import { cva, type VariantProps } from 'class-variance-authority';

/*
 * Form fields read their colors from `--sui-input--*` variables, which components.css binds to
 * the optional `--sui-input-*` tokens with semantic fallbacks. Logical properties (`px`, `ps`,
 * `pe`, `end`) keep every field correct in right-to-left layouts.
 */

const typography =
  'sui:[font-family:inherit] sui:text-fg sui:placeholder:text-(color:--sui-input--placeholder)';

/** Border, background and focus treatment of a standalone field (or of an input group). */
const frame = [
  'sui:rounded-md sui:border sui:border-solid sui:border-(color:--sui-input--border) sui:bg-(color:--sui-input--bg)',
  'sui:transition-colors sui:motion-reduce:transition-none',
  'sui:not-disabled:hover:border-(color:--sui-input--border-hover)',
  'sui:aria-invalid:border-(color:--sui-input--border-invalid) sui:not-disabled:aria-invalid:hover:border-(color:--sui-input--border-invalid)',
  'sui:focus-visible:outline-2 sui:focus-visible:outline-solid sui:focus-visible:outline-offset-2 sui:focus-visible:outline-ring',
  // The attribute, not `:read-only`, which also matches selects and disabled fields.
  'sui:[&[readonly]]:bg-(color:--sui-input--bg-readonly)',
];

/**
 * Inside an input group the group draws the frame and the inline padding, so the field itself is
 * transparent and sits next to the addons.
 */
const grouped = 'sui:rounded-none sui:border-0 sui:bg-transparent sui:px-0 sui:outline-none';

const states = 'sui:disabled:cursor-not-allowed sui:disabled:opacity-50';

export const inputVariants = cva(
  ['sui:box-border sui:m-0 sui:w-full sui:min-w-0', typography, states],
  {
    variants: {
      size: {
        sm: 'sui:h-8 sui:text-sm',
        md: 'sui:h-9 sui:text-sm',
        lg: 'sui:h-10 sui:text-base',
      },
      grouped: {
        false: frame,
        true: grouped,
      },
    },
    compoundVariants: [
      { grouped: false, size: 'sm', className: 'sui:px-2.5' },
      { grouped: false, size: 'md', className: 'sui:px-3' },
      { grouped: false, size: 'lg', className: 'sui:px-3.5' },
    ],
    defaultVariants: { size: 'md', grouped: false },
  },
);

export const textareaVariants = cva(
  [
    'sui:box-border sui:m-0 sui:block sui:w-full sui:min-w-0 sui:min-h-20',
    typography,
    states,
    frame,
  ],
  {
    variants: {
      size: {
        sm: 'sui:px-2.5 sui:py-1.5 sui:text-sm',
        md: 'sui:px-3 sui:py-2 sui:text-sm',
        lg: 'sui:px-3.5 sui:py-2.5 sui:text-base',
      },
      autoResize: {
        false: 'sui:resize-y',
        true: 'sui:resize-none sui:overflow-hidden',
      },
    },
    defaultVariants: { size: 'md', autoResize: false },
  },
);

/** Native select with a custom chevron; padding leaves room for the icon at the inline end. */
export const selectVariants = cva(
  [
    'sui:box-border sui:m-0 sui:w-full sui:min-w-0 sui:appearance-none sui:cursor-pointer',
    typography,
    states,
    frame,
  ],
  {
    variants: {
      size: {
        sm: 'sui:h-8 sui:ps-2.5 sui:pe-8 sui:text-sm',
        md: 'sui:h-9 sui:ps-3 sui:pe-9 sui:text-sm',
        lg: 'sui:h-10 sui:ps-3.5 sui:pe-10 sui:text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

export const selectWrapperClassName = 'sui:relative sui:flex sui:w-full sui:min-w-0';

export const selectIconClassName =
  'sui:pointer-events-none sui:absolute sui:inset-y-0 sui:end-2.5 sui:flex sui:items-center sui:text-fg-muted sui:[&>svg]:size-4';

/**
 * Frame shared by an input and its addons. Focus and invalid states follow the input inside it,
 * so the whole group looks like one field.
 */
export const inputGroupVariants = cva(
  [
    'sui:box-border sui:flex sui:w-full sui:min-w-0 sui:items-center sui:gap-2',
    'sui:rounded-md sui:border sui:border-solid sui:border-(color:--sui-input--border) sui:bg-(color:--sui-input--bg)',
    'sui:transition-colors sui:motion-reduce:transition-none',
    'sui:hover:border-(color:--sui-input--border-hover)',
    'sui:has-[[aria-invalid=true]]:border-(color:--sui-input--border-invalid)',
    'sui:has-[input:focus-visible]:outline-2 sui:has-[input:focus-visible]:outline-solid sui:has-[input:focus-visible]:outline-offset-2 sui:has-[input:focus-visible]:outline-ring',
    'sui:has-[input:disabled]:opacity-50',
  ],
  {
    variants: {
      size: {
        sm: 'sui:h-8 sui:px-2.5 sui:text-sm',
        md: 'sui:h-9 sui:px-3 sui:text-sm',
        lg: 'sui:h-10 sui:px-3.5 sui:text-base',
      },
    },
    defaultVariants: { size: 'md' },
  },
);

/** Text or icon before or after the input: units, prefixes, a search icon, an inline button. */
export const inputGroupAddonClassName = [
  'sui:flex sui:h-full sui:shrink-0 sui:items-center sui:gap-1 sui:text-fg-muted sui:select-none sui:[&>svg]:size-4',
  // An inline button moves closer to the edge of the group, like a button inside the field.
  'sui:has-[[data-sui-button]]:first:-ms-2 sui:has-[[data-sui-button]]:last:-me-2',
].join(' ');

export type InputVariantProps = VariantProps<typeof inputVariants>;
export type InputSize = NonNullable<InputVariantProps['size']>;

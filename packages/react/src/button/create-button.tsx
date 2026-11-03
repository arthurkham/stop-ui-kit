'use client';

import * as React from 'react';
import { contrastRatio } from '@stop-ui/core';
import { cn, type ButtonSize, type ButtonTone, type ButtonVariant } from '@stop-ui/styles';
import { ButtonBase, type ButtonBaseProps } from './button-base.js';

/** A custom shape: class names that replace the built-in shape, or extend one of them. */
export type ButtonVariantDefinition = string | { extends: ButtonVariant; className: string };

/** Colors of a custom tone. Soft, outline and ghost backgrounds are derived from `color`. */
export interface ButtonToneDefinition {
  /** Background of solid buttons and base color for the other shapes. */
  color: string;
  /** Background of solid buttons on hover. */
  hover: string;
  /** Text on `color` and `hover`. */
  fg: string;
  /**
   * Text on tints and transparent backgrounds (soft, outline, ghost).
   * @default color
   */
  text?: string;
}

export interface CreateButtonOptions<TTone extends string, TVariant extends string> {
  /** Additional color tones. They work with every shape. */
  tones?: Record<TTone, ButtonToneDefinition>;
  /**
   * Additional shapes. Either class names that replace the built-in shape classes, or
   * `{ extends, className }` to build on a built-in shape (e.g. a pill-shaped `solid`).
   * Shapes written from scratch should read colors from the tone variables: `--sui-tone`,
   * `--sui-tone-hover`, `--sui-tone-fg`, `--sui-tone-text`, `--sui-tone-soft`, `--sui-tone-border`.
   */
  variants?: Record<TVariant, ButtonVariantDefinition>;
  /** Defaults applied when a prop is not set. */
  defaults?: {
    variant?: ButtonVariant | TVariant;
    tone?: ButtonTone | TTone;
    size?: ButtonSize;
  };
}

export type CreatedButtonProps<TTone extends string, TVariant extends string> = ButtonBaseProps<
  ButtonVariant | TVariant,
  ButtonTone | TTone
>;

const MIN_CONTRAST = 4.5;

function warnAboutContrast(tones: Record<string, ButtonToneDefinition>): void {
  for (const [name, tone] of Object.entries(tones)) {
    const pairs: [string, string, string][] = [
      ['fg on color', tone.fg, tone.color],
      ['fg on hover', tone.fg, tone.hover],
      ['text on white', tone.text ?? tone.color, '#ffffff'],
    ];
    for (const [label, foreground, background] of pairs) {
      const ratio = contrastRatio(foreground, background);
      if (ratio !== null && ratio < MIN_CONTRAST) {
        console.warn(
          `[@stop-ui/react] createButton: tone "${name}" ${label} has a contrast of ${ratio.toFixed(2)}:1, ` +
            `below the WCAG AA minimum of ${MIN_CONTRAST}:1.`,
        );
      }
    }
  }
}

/**
 * Creates a project-specific `Button` with additional tones, shapes and defaults.
 * Call it once (e.g. in `app/ui/button.tsx`) and use the result everywhere instead of `Button`.
 *
 * @example
 * export const Button = createButton({
 *   tones: {
 *     success: { color: '#15803d', hover: '#166534', fg: '#ffffff' },
 *   },
 *   variants: {
 *     pill: { extends: 'solid', className: 'rounded-full px-6' },
 *   },
 *   defaults: { size: 'sm' },
 * });
 *
 * <Button tone="success" variant="pill">Confirm</Button>
 */
export function createButton<TTone extends string = never, TVariant extends string = never>(
  options: CreateButtonOptions<TTone, TVariant> = {},
): React.ForwardRefExoticComponent<
  CreatedButtonProps<TTone, TVariant> & React.RefAttributes<HTMLButtonElement>
> {
  const tones: Record<string, ButtonToneDefinition> = options.tones ?? {};
  const variants: Record<string, ButtonVariantDefinition> = options.variants ?? {};
  const defaults = options.defaults ?? {};

  if (process.env.NODE_ENV !== 'production') {
    warnAboutContrast(tones);
  }

  const toneStyles = Object.fromEntries(
    Object.entries(tones).map(([name, tone]) => [
      name,
      {
        '--sui-tone': tone.color,
        '--sui-tone-hover': tone.hover,
        '--sui-tone-fg': tone.fg,
        '--sui-tone-text': tone.text ?? tone.color,
      } as React.CSSProperties,
    ]),
  );

  const CreatedButton = React.forwardRef<HTMLButtonElement, ButtonBaseProps>(function Button(
    {
      variant = defaults.variant,
      tone = defaults.tone,
      size = defaults.size,
      className,
      style,
      ...props
    },
    ref,
  ) {
    const toneStyle =
      tone !== undefined && Object.hasOwn(toneStyles, tone) ? toneStyles[tone] : undefined;
    const custom =
      variant !== undefined && Object.hasOwn(variants, variant) ? variants[variant] : undefined;
    const variantClassName = typeof custom === 'string' ? custom : custom?.className;
    const baseVariant = typeof custom === 'object' ? custom.extends : undefined;

    return (
      <ButtonBase
        {...props}
        ref={ref}
        variant={variant}
        baseVariant={baseVariant}
        tone={tone}
        size={size}
        className={cn(variantClassName, className)}
        style={toneStyle ? { ...toneStyle, ...style } : style}
      />
    );
  });

  return CreatedButton as React.ForwardRefExoticComponent<
    CreatedButtonProps<TTone, TVariant> & React.RefAttributes<HTMLButtonElement>
  >;
}

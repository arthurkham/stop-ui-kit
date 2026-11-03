'use client';

import * as React from 'react';
import { announce } from '@stop-ui/core';
import {
  buttonSpinnerClassName,
  buttonVariants,
  cn,
  type ButtonVariantProps,
} from '@stop-ui/styles';
import { setRef } from '../internal/compose-refs/index.js';
import { Slot } from '../internal/slot/index.js';

type NativeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

interface ButtonElementProps {
  /**
   * Render the single child element (e.g. a link) with button styles instead of a `<button>`.
   * The child keeps its own semantics, so `loading`, `disabled` and `type` are not available.
   */
  asChild?: false;
  /**
   * Shows a spinner and ignores activation while keeping the button focusable,
   * so keyboard and screen reader users do not lose their place.
   */
  loading?: boolean;
  /**
   * Message announced to screen reader users when the focused button starts loading.
   * @default 'Loading'
   */
  loadingLabel?: string;
}

interface ButtonSlotProps {
  asChild: true;
  loading?: never;
  loadingLabel?: never;
  disabled?: never;
  type?: never;
}

export type ButtonProps = NativeButtonProps &
  ButtonVariantProps &
  (ButtonElementProps | ButtonSlotProps);

function ButtonSpinner() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className={buttonSpinnerClassName}>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Triggers an action. Renders a native `<button type="button">` by default.
 *
 * @example
 * <Button variant="secondary" onClick={save}>Save</Button>
 *
 * @example
 * <Button asChild>
 *   <a href="/docs">Read the docs</a>
 * </Button>
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant,
    size,
    asChild,
    loading = false,
    loadingLabel = 'Loading',
    type,
    onClick,
    children,
    ...props
  },
  forwardedRef,
) {
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);

  const composedRef = React.useCallback(
    (node: HTMLButtonElement | null) => {
      buttonRef.current = node;
      setRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  // `aria-busy` alone is not announced by most screen readers, so the state change is
  // announced explicitly when the user is on the button (i.e. has just activated it).
  React.useEffect(() => {
    if (loading && buttonRef.current !== null && buttonRef.current === document.activeElement) {
      announce(loadingLabel);
    }
  }, [loading, loadingLabel]);

  const classes = cn(buttonVariants({ variant, size }), className);

  if (asChild) {
    return (
      <Slot ref={composedRef} className={classes} onClick={onClick} {...props}>
        {children}
      </Slot>
    );
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (loading) {
      // Also blocks implicit form submission triggered by pressing Enter in a field.
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };

  return (
    <button
      {...props}
      ref={composedRef}
      // Native buttons default to `submit`, which causes accidental form submissions.
      type={type ?? 'button'}
      className={classes}
      aria-disabled={loading ? true : props['aria-disabled']}
      aria-busy={loading ? true : props['aria-busy']}
      onClick={handleClick}
    >
      {loading && <ButtonSpinner />}
      {children}
    </button>
  );
});

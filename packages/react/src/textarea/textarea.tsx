'use client';

import * as React from 'react';
import { cn, textareaVariants, type InputSize } from '@stop-ui/styles';
import { setRef } from '../internal/compose-refs/index.js';
import { useIsomorphicLayoutEffect } from '../internal/use-isomorphic-layout-effect.js';
import { useFieldControl } from '../field/field-context.js';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /**
   * Padding and font size.
   * @default 'md'
   */
  size?: InputSize;
  /**
   * Grow with the content instead of scrolling. Limit the height with `max-height` if needed;
   * beyond it the textarea scrolls.
   * @default false
   */
  autoResize?: boolean;
}

/**
 * A native multi-line text input. Inside a `Field`, it is connected to the label, description
 * and error automatically.
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { size = 'md', autoResize = false, className, onInput, rows = 3, ...props },
  forwardedRef,
) {
  const innerRef = React.useRef<HTMLTextAreaElement | null>(null);

  const composedRef = React.useCallback(
    (node: HTMLTextAreaElement | null) => {
      innerRef.current = node;
      setRef(forwardedRef, node);
    },
    [forwardedRef],
  );

  const resize = React.useCallback(() => {
    const element = innerRef.current;
    if (!element || !autoResize) return;
    // `field-sizing: content` is not supported everywhere yet, so the height is measured.
    element.style.height = 'auto';
    const { borderTopWidth, borderBottomWidth, maxHeight } = getComputedStyle(element);
    const height =
      element.scrollHeight +
      Number.parseFloat(borderTopWidth) +
      Number.parseFloat(borderBottomWidth);
    element.style.height = `${String(height)}px`;
    element.style.overflowY =
      maxHeight !== 'none' && height > Number.parseFloat(maxHeight) ? 'auto' : 'hidden';
  }, [autoResize]);

  // Controlled values change without an input event.
  useIsomorphicLayoutEffect(resize, [resize, props.value]);

  // Text reflows when the width changes.
  React.useEffect(() => {
    const element = innerRef.current;
    if (!autoResize || !element || typeof ResizeObserver === 'undefined') return undefined;
    let width = element.offsetWidth;
    const observer = new ResizeObserver(() => {
      if (element.offsetWidth !== width) {
        width = element.offsetWidth;
        resize();
      }
    });
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [autoResize, resize]);

  return (
    <textarea
      {...useFieldControl(props)}
      ref={composedRef}
      rows={rows}
      className={cn(textareaVariants({ size, autoResize }), className)}
      data-sui-textarea=""
      data-size={size}
      onInput={(event) => {
        resize();
        onInput?.(event);
      }}
    />
  );
});

'use client';

import * as React from 'react';
import {
  cn,
  selectIconClassName,
  selectVariants,
  selectWrapperClassName,
  type InputSize,
} from '@stop-ui/styles';
import { useFieldControl } from '../field/field-context.js';

export interface NativeSelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  'size'
> {
  /**
   * Height, padding and font size; matches `Input` and `Button`.
   * @default 'md'
   */
  size?: InputSize;
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="m4 6 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A styled native `<select>`. The option list is the platform's own, which gives the best
 * keyboard, screen reader and mobile support. Inside a `Field`, it is connected to the label,
 * description and error automatically.
 *
 * @example
 * <NativeSelect defaultValue="pl">
 *   <option value="pl">Poland</option>
 *   <option value="de">Germany</option>
 * </NativeSelect>
 */
export const NativeSelect = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  function NativeSelect({ size = 'md', className, children, ...props }, ref) {
    return (
      <span className={selectWrapperClassName} data-sui-select-wrapper="">
        <select
          {...useFieldControl(props, { readOnly: false })}
          ref={ref}
          className={cn(selectVariants({ size }), className)}
          data-sui-select=""
          data-size={size}
        >
          {children}
        </select>
        <span aria-hidden="true" className={selectIconClassName}>
          <ChevronIcon />
        </span>
      </span>
    );
  },
);

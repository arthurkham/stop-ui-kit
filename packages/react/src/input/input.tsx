'use client';

import * as React from 'react';
import { cn, inputVariants, type InputSize } from '@stop-ui/styles';
import { useFieldControl } from '../field/field-context.js';
import { InputGroupContext } from '../input-group/input-group-context.js';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /**
   * Height, padding and font size; matches `Button` sizes, so both align in a row.
   * Inside an `InputGroup`, defaults to the group's size.
   * @default 'md'
   */
  size?: InputSize;
}

/**
 * A native text input. Inside a `Field`, it is connected to the label, description and error
 * automatically. Works with uncontrolled forms, controlled state and form libraries alike.
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { size, className, ...props },
  ref,
) {
  const group = React.useContext(InputGroupContext);
  const resolvedSize = size ?? group?.size ?? 'md';

  return (
    <input
      {...useFieldControl(props)}
      ref={ref}
      className={cn(inputVariants({ size: resolvedSize, grouped: group !== null }), className)}
      data-sui-input=""
      data-size={resolvedSize}
    />
  );
});

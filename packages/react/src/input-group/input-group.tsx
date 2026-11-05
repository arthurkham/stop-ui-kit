'use client';

import * as React from 'react';
import { cn, inputGroupAddonClassName, inputGroupVariants, type InputSize } from '@stop-ui/styles';
import { InputGroupContext } from './input-group-context.js';

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Size of the group and the input inside it.
   * @default 'md'
   */
  size?: InputSize;
}

/**
 * Joins an `Input` with addons before or after it (units, prefixes, icons, an inline button)
 * into what looks like one field. Focus, hover and invalid states follow the input.
 *
 * Addons are not part of the input's accessible name: put meaningful units into the label too
 * (e.g. "Price, EUR"), and give inline buttons their own accessible name.
 *
 * @example
 * <InputGroup>
 *   <InputGroupAddon>https://</InputGroupAddon>
 *   <Input aria-label="Website" />
 * </InputGroup>
 */
export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(function InputGroup(
  { size = 'md', className, children, ...props },
  ref,
) {
  const value = React.useMemo(() => ({ size }), [size]);

  return (
    <InputGroupContext.Provider value={value}>
      <div
        {...props}
        ref={ref}
        className={cn(inputGroupVariants({ size }), className)}
        data-sui-input-group=""
        data-size={size}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
});

export type InputGroupAddonProps = React.HTMLAttributes<HTMLSpanElement>;

/** Static text, an icon or a small button placed before or after the input in an `InputGroup`. */
export const InputGroupAddon = React.forwardRef<HTMLSpanElement, InputGroupAddonProps>(
  function InputGroupAddon({ className, ...props }, ref) {
    return (
      <span
        {...props}
        ref={ref}
        className={cn(inputGroupAddonClassName, className)}
        data-sui-input-group-addon=""
      />
    );
  },
);

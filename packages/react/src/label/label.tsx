'use client';

import * as React from 'react';
import { cn, labelClassName, requiredMarkerClassName } from '@stop-ui/styles';
import { useFieldContext } from '../field/field-context.js';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  /** Shows the required marker. Defaults to the surrounding `Field`. */
  required?: boolean;
}

/**
 * Label for a form control. Inside a `Field` it targets the field's control automatically and
 * shows a visual marker when the field is required (screen readers announce "required" from the
 * control itself, so the marker is hidden from them).
 */
export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { htmlFor, required, className, children, ...props },
  ref,
) {
  const field = useFieldContext();
  const isRequired = required ?? field?.required ?? false;

  return (
    <label
      {...props}
      ref={ref}
      htmlFor={htmlFor ?? field?.controlId}
      className={cn(labelClassName, className)}
      data-sui-label=""
      data-disabled={field?.disabled ? '' : undefined}
    >
      {children}
      {isRequired && (
        <span aria-hidden="true" className={requiredMarkerClassName}>
          *
        </span>
      )}
    </label>
  );
});

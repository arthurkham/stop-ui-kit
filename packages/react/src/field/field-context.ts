'use client';

import * as React from 'react';

export type FieldPart = 'description' | 'error';

export interface FieldContextValue {
  controlId: string;
  descriptionId: string;
  errorId: string;
  hasDescription: boolean;
  hasError: boolean;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
  readOnly: boolean;
  registerPart: (part: FieldPart, present: boolean) => void;
}

export const FieldContext = React.createContext<FieldContextValue | null>(null);

/** The surrounding `Field`, if any. */
export function useFieldContext(): FieldContextValue | null {
  return React.useContext(FieldContext);
}

interface FieldControlProps {
  id?: string;
  'aria-describedby'?: string;
  'aria-invalid'?: React.AriaAttributes['aria-invalid'];
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

interface FieldControlOptions {
  /** Whether the control supports `readOnly` (selects, checkboxes and radios do not). */
  readOnly?: boolean;
}

/**
 * Connects a form control to the surrounding `Field`: id for the label, description and error
 * via `aria-describedby`, and the invalid, required, disabled and read-only states. Props set
 * on the control win. Use it to build custom controls that behave like the kit's own.
 *
 * @example
 * function ColorInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
 *   return <input type="color" {...useFieldControl(props)} />;
 * }
 */
export function useFieldControl<P extends FieldControlProps>(
  props: P,
  options: FieldControlOptions = {},
): P {
  const field = useFieldContext();
  if (!field) {
    return props;
  }

  const describedBy =
    [
      props['aria-describedby'],
      field.hasDescription ? field.descriptionId : undefined,
      field.hasError ? field.errorId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const merged: P = {
    ...props,
    id: props.id ?? field.controlId,
    'aria-describedby': describedBy,
    'aria-invalid': props['aria-invalid'] ?? (field.invalid ? true : undefined),
    required: props.required ?? (field.required ? true : undefined),
    disabled: props.disabled ?? (field.disabled ? true : undefined),
  };
  if (options.readOnly !== false) {
    merged.readOnly = props.readOnly ?? (field.readOnly ? true : undefined);
  }
  return merged;
}

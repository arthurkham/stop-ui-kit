'use client';

import * as React from 'react';
import {
  cn,
  fieldClassName,
  fieldDescriptionClassName,
  fieldErrorClassName,
  fieldErrorIconClassName,
} from '@stop-ui/styles';
import { useIsomorphicLayoutEffect } from '../internal/use-isomorphic-layout-effect.js';
import { FieldContext, useFieldContext, type FieldPart } from './field-context.js';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Id of the control. Generated when omitted. */
  id?: string;
  /** Marks the control as invalid (`aria-invalid`) and shows the error state. */
  invalid?: boolean;
  /** Marks the control as required; the label shows a visual marker. */
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
}

/**
 * Groups a label, a control, a description and an error message, and connects them for
 * assistive technology: the label targets the control, the description and error are linked
 * with `aria-describedby`, and the invalid, required, disabled and read-only states reach the
 * control.
 *
 * @example
 * <Field invalid={!!error} required>
 *   <Label>Email</Label>
 *   <Input type="email" />
 *   <FieldDescription>We never share it.</FieldDescription>
 *   <FieldError>{error}</FieldError>
 * </Field>
 */
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(function Field(
  {
    id,
    invalid = false,
    required = false,
    disabled = false,
    readOnly = false,
    className,
    children,
    ...props
  },
  ref,
) {
  const generatedId = React.useId();
  const [parts, setParts] = React.useState({ description: false, error: false });

  const registerPart = React.useCallback((part: FieldPart, present: boolean) => {
    setParts((current) => (current[part] === present ? current : { ...current, [part]: present }));
  }, []);

  const value = React.useMemo(
    () => ({
      controlId: id ?? `${generatedId}control`,
      descriptionId: `${generatedId}description`,
      errorId: `${generatedId}error`,
      hasDescription: parts.description,
      hasError: parts.error,
      invalid,
      required,
      disabled,
      readOnly,
      registerPart,
    }),
    [id, generatedId, parts, invalid, required, disabled, readOnly, registerPart],
  );

  return (
    <FieldContext.Provider value={value}>
      <div
        {...props}
        ref={ref}
        className={cn(fieldClassName, className)}
        data-sui-field=""
        data-invalid={invalid ? '' : undefined}
        data-disabled={disabled ? '' : undefined}
      >
        {children}
      </div>
    </FieldContext.Provider>
  );
});

function useRegisterPart(part: FieldPart, present: boolean): void {
  const field = useFieldContext();
  const registerPart = field?.registerPart;
  useIsomorphicLayoutEffect(() => {
    if (!registerPart) return undefined;
    registerPart(part, present);
    return () => {
      registerPart(part, false);
    };
  }, [registerPart, part, present]);
}

const hasContent = (children: React.ReactNode): boolean =>
  children !== undefined && children !== null && children !== false && children !== '';

export type FieldDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/** Hint text for the control, linked with `aria-describedby`. */
export const FieldDescription = React.forwardRef<HTMLParagraphElement, FieldDescriptionProps>(
  function FieldDescription({ id, className, children, ...props }, ref) {
    const field = useFieldContext();
    const present = hasContent(children);
    useRegisterPart('description', present);
    if (!present) return null;

    return (
      <p
        {...props}
        ref={ref}
        id={id ?? field?.descriptionId}
        className={cn(fieldDescriptionClassName, className)}
        data-sui-field-description=""
      >
        {children}
      </p>
    );
  },
);

export interface FieldErrorProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /**
   * Announce the message as soon as it appears (polite live region). Off by default: errors are
   * read when the control is focused, and live announcements while typing are noisy.
   */
  live?: boolean;
}

function ErrorIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      fill="currentColor"
      className={fieldErrorIconClassName}
    >
      <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm-.75 3.5a.75.75 0 0 1 1.5 0v4a.75.75 0 0 1-1.5 0v-4ZM8 12a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z" />
    </svg>
  );
}

/**
 * Error message for the control, linked with `aria-describedby`. Renders nothing without
 * content, so it can always be present: `<FieldError>{errors.email?.message}</FieldError>`.
 * Always pair it with `invalid` on the `Field`.
 */
export const FieldError = React.forwardRef<HTMLParagraphElement, FieldErrorProps>(
  function FieldError({ id, live = false, className, children, ...props }, ref) {
    const field = useFieldContext();
    const present = hasContent(children);
    useRegisterPart('error', present);

    // A live region must exist before its content changes to be announced reliably.
    if (!present && !live) return null;

    return (
      <p
        {...props}
        ref={ref}
        id={id ?? field?.errorId}
        className={present ? cn(fieldErrorClassName, className) : undefined}
        data-sui-field-error=""
        aria-live={live ? 'polite' : undefined}
      >
        {present && (
          <>
            <ErrorIcon />
            <span>{children}</span>
          </>
        )}
      </p>
    );
  },
);

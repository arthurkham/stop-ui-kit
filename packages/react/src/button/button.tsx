'use client';

import type * as React from 'react';
import type { ButtonTone, ButtonVariant } from '@stop-ui/styles';
import { ButtonBase, type ButtonBaseProps } from './button-base.js';

export type ButtonProps = ButtonBaseProps<ButtonVariant, ButtonTone>;

/**
 * Triggers an action. Renders a native `<button type="button">` by default.
 *
 * Shape (`variant`) and color (`tone`) are independent, so every tone works with every shape.
 * Add project-specific tones and shapes with `createButton`.
 *
 * @example
 * <Button onClick={save}>Save</Button>
 * <Button variant="outline" tone="neutral">Cancel</Button>
 * <Button variant="soft" tone="danger">Delete</Button>
 *
 * @example
 * <Button asChild>
 *   <a href="/docs">Read the docs</a>
 * </Button>
 */
export const Button = ButtonBase as React.ForwardRefExoticComponent<
  ButtonProps & React.RefAttributes<HTMLButtonElement>
>;

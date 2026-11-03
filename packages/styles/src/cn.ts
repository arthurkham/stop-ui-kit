import { clsx, type ClassValue } from 'clsx';

/**
 * Joins class names, skipping falsy values.
 *
 * Kit recipes never produce conflicting utilities (verified by tests), and kit styles live in a
 * lower cascade layer than application utilities, so overrides such as `className="px-8"` win
 * without runtime class merging.
 *
 * @example
 * cn(buttonVariants({ size: 'sm' }), isActive && 'is-active', className);
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  prefix: 'sui',
});

/**
 * Combines class names and resolves conflicting Tailwind utilities,
 * so that later classes win (e.g. a consumer's `className` override).
 *
 * @example
 * cn('sui:px-2 sui:py-1', isActive && 'sui:bg-primary', className);
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

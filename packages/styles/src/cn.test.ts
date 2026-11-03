import { describe, expect, it } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('sui:flex', false, null, undefined, 'sui:gap-2')).toBe('sui:flex sui:gap-2');
  });

  it('lets later prefixed utilities override earlier ones', () => {
    expect(cn('sui:px-2 sui:py-1', 'sui:px-4')).toBe('sui:py-1 sui:px-4');
  });

  it('resolves conflicts within variants independently', () => {
    expect(cn('sui:hover:bg-red-500', 'sui:bg-blue-500', 'sui:hover:bg-green-500')).toBe(
      'sui:bg-blue-500 sui:hover:bg-green-500',
    );
  });

  it('keeps unprefixed consumer classes untouched', () => {
    expect(cn('sui:px-2', 'my-custom-class')).toBe('sui:px-2 my-custom-class');
  });
});

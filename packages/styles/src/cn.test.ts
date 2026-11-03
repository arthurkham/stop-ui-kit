import { describe, expect, it } from 'vitest';
import { cn } from './cn.js';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', false, null, undefined, 'b', { c: true, d: false })).toBe('a b c');
  });

  it('keeps every class: overrides are resolved by cascade layers, not by removal', () => {
    expect(cn('sui:px-4', 'px-8')).toBe('sui:px-4 px-8');
  });
});

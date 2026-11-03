import { describe, expect, it } from 'vitest';
import { contrastRatio, parseHexColor } from './contrast.js';

describe('parseHexColor', () => {
  it('parses short and long hex colors', () => {
    expect(parseHexColor('#fff')).toEqual([255, 255, 255]);
    expect(parseHexColor('#0B2F1D')).toEqual([11, 47, 29]);
  });

  it('returns null for values it cannot evaluate', () => {
    expect(parseHexColor('var(--brand)')).toBeNull();
    expect(parseHexColor('oklch(0.5 0.1 150)')).toBeNull();
    expect(parseHexColor('red')).toBeNull();
  });
});

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000', '#fff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });

  it('returns null when a color cannot be evaluated', () => {
    expect(contrastRatio('var(--fg)', '#fff')).toBeNull();
  });
});

import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  buildTokens,
  checkContrast,
  contrastRatio,
  cssVariableName,
  loadThemes,
  type ContrastResult,
} from './build.ts';

describe('contrastRatio', () => {
  it('matches the WCAG reference values', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
    expect(contrastRatio('#ffffff', '#ffffff')).toBeCloseTo(1, 5);
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });
});

describe('cssVariableName', () => {
  it('drops the "color" group for palette steps and keeps other groups', () => {
    expect(cssVariableName(['color', 'green', '950'])).toBe('--sui-green-950');
    expect(cssVariableName(['radius', 'md'])).toBe('--sui-radius-md');
    expect(cssVariableName(['surface'])).toBe('--sui-surface');
  });
});

describe('checkContrast', () => {
  it('reports pairs below the minimum and unknown tokens', async () => {
    const themes = await loadThemes();
    const results = checkContrast(themes, [
      { foreground: 'border', background: ['surface'], min: 4.5, reason: 'test' },
    ]);
    expect(results.some((result) => !result.passed)).toBe(true);

    expect(() =>
      checkContrast(themes, [
        { foreground: 'missing', background: ['surface'], min: 1, reason: '' },
      ]),
    ).toThrow(/unknown token "missing"/);
  });
});

describe('buildTokens', () => {
  let outDir: string;
  let results: ContrastResult[];
  const read = (file: string) => readFileSync(join(outDir, file), 'utf8');

  beforeAll(async () => {
    outDir = mkdtempSync(join(tmpdir(), 'stop-ui-tokens-'));
    results = await buildTokens(outDir);
  });

  afterAll(() => {
    rmSync(outDir, { recursive: true, force: true });
  });

  it('passes every contrast rule in every theme', () => {
    expect(results.length).toBeGreaterThan(0);
    expect(results.filter((result) => !result.passed)).toEqual([]);
    expect(new Set(results.map((result) => result.theme))).toEqual(new Set(['light', 'dark']));
  });

  it('generates the dark and system-dark blocks from the same source', () => {
    const css = read('tokens.css');
    const block = (start: string) => {
      const from = css.indexOf(start);
      return css.slice(css.indexOf('{', from) + 1, css.indexOf('}', from));
    };
    const dark = block("[data-sui-theme='dark'] {");
    const systemDark = block(
      "@media (prefers-color-scheme: dark) {\n    [data-sui-theme='system'] {",
    );
    const declarations = (text: string) =>
      text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.startsWith('--sui-'));
    expect(declarations(dark).length).toBeGreaterThan(0);
    expect(declarations(systemDark)).toEqual(declarations(dark));
  });

  it('keeps theme values as references to primitives', () => {
    expect(read('tokens.css')).toContain('--sui-primary: var(--sui-green-950);');
  });

  it('derives rem-based sizes from --sui-rem', () => {
    const css = read('tokens.css');
    expect(css).toContain('--sui-rem: 1rem;');
    expect(css).toContain('--sui-radius-md: calc(var(--sui-rem) * 0.375);');
  });

  it('starts the kit theme from an empty Tailwind theme', () => {
    expect(read('tailwind-theme.css')).toMatch(/@theme inline \{\n {2}--\*: initial;/);
  });

  it('namespaces the application preset under "sui"', () => {
    const preset = read('tailwind.css');
    expect(preset).toContain('--color-sui-primary: var(--sui-primary);');
    expect(preset).not.toMatch(/--color-primary:/);
  });

  it('binds optional component tokens with semantic fallbacks', () => {
    const css = read('components.css');
    expect(css).toContain('--sui-tone: var(--sui-button-primary, var(--sui-primary));');
    expect(css).toContain(
      '--sui-input--border: var(--sui-input-border, var(--sui-border-strong));',
    );
    expect(css).toMatch(/\[data-sui-input\],\n {2}\[data-sui-textarea\]/);
  });

  it('checks component contrast rules in every theme', () => {
    const placeholder = results.filter((result) => result.foreground === 'input.placeholder');
    expect(placeholder.map((result) => result.theme).sort()).toEqual(['dark', 'light']);
  });

  it('exports typed references', () => {
    expect(read('index.js')).toContain('"primary": "var(--sui-primary)"');
    expect(read('index.d.ts')).toContain('export type SemanticColor');
  });
});

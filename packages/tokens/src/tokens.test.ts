import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./tokens.css', import.meta.url), 'utf8');

function declarations(block: string): string[] {
  return block
    .split(';')
    .map((line) => line.trim())
    .filter((line) => line.startsWith('--sui-'))
    .sort();
}

function blockAfter(marker: string): string {
  const start = css.indexOf(marker);
  if (start === -1) throw new Error(`Missing block: ${marker}`);
  const open = css.indexOf('{', start + marker.length - 1);
  const close = css.indexOf('}', open);
  return css.slice(open + 1, close);
}

describe('theme tokens', () => {
  it('keeps the system dark theme in sync with the dark theme', () => {
    const dark = declarations(blockAfter("[data-sui-theme='dark'] {"));
    const systemDark = declarations(
      blockAfter("@media (prefers-color-scheme: dark) {\n    [data-sui-theme='system'] {"),
    );
    expect(dark.length).toBeGreaterThan(0);
    expect(systemDark).toEqual(dark);
  });
});

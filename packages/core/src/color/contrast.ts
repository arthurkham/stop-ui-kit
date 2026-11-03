type Rgb = readonly [number, number, number];

/** Parses `#rgb` or `#rrggbb`. Returns `null` for anything else (named colors, `var()`, `oklch()`, …). */
export function parseHexColor(value: string): Rgb | null {
  const match = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(value.trim());
  const hex = match?.[1];
  if (!hex) {
    return null;
  }
  const full = hex.length === 3 ? hex.replace(/./g, (char) => char + char) : hex;
  return [0, 2, 4].map((index) =>
    Number.parseInt(full.slice(index, index + 2), 16),
  ) as unknown as Rgb;
}

function relativeLuminance([r, g, b]: Rgb): number {
  const linear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/**
 * WCAG 2.x contrast ratio between two hex colors, or `null` if either color cannot be parsed.
 *
 * @example
 * contrastRatio('#ffffff', '#0b2f1d'); // 14.6
 */
export function contrastRatio(foreground: string, background: string): number | null {
  const a = parseHexColor(foreground);
  const b = parseHexColor(background);
  if (!a || !b) {
    return null;
  }
  const [lighter, darker] = [relativeLuminance(a), relativeLuminance(b)].sort((x, y) => y - x) as [
    number,
    number,
  ];
  return (lighter + 0.05) / (darker + 0.05);
}

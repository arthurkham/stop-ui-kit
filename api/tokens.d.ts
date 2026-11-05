// index.d.ts
export declare const tokens: {
  "color": {
    "surface": "var(--sui-surface)",
    "surfaceSubtle": "var(--sui-surface-subtle)",
    "fg": "var(--sui-fg)",
    "fgMuted": "var(--sui-fg-muted)",
    "border": "var(--sui-border)",
    "borderStrong": "var(--sui-border-strong)",
    "primary": "var(--sui-primary)",
    "primaryHover": "var(--sui-primary-hover)",
    "primaryFg": "var(--sui-primary-fg)",
    "neutral": "var(--sui-neutral)",
    "neutralHover": "var(--sui-neutral-hover)",
    "neutralFg": "var(--sui-neutral-fg)",
    "danger": "var(--sui-danger)",
    "dangerHover": "var(--sui-danger-hover)",
    "dangerFg": "var(--sui-danger-fg)",
    "dangerText": "var(--sui-danger-text)",
    "ring": "var(--sui-ring)"
  },
  "rem": "var(--sui-rem)",
  "spacing": "var(--sui-spacing)",
  "radius": {
    "sm": "var(--sui-radius-sm)",
    "md": "var(--sui-radius-md)",
    "lg": "var(--sui-radius-lg)",
    "full": "var(--sui-radius-full)"
  },
  "text": {
    "xs": "var(--sui-text-xs)",
    "sm": "var(--sui-text-sm)",
    "base": "var(--sui-text-base)",
    "lg": "var(--sui-text-lg)"
  },
  "leading": {
    "xs": "var(--sui-leading-xs)",
    "sm": "var(--sui-leading-sm)",
    "base": "var(--sui-leading-base)",
    "lg": "var(--sui-leading-lg)"
  },
  "fontWeight": {
    "normal": "var(--sui-font-weight-normal)",
    "medium": "var(--sui-font-weight-medium)",
    "semibold": "var(--sui-font-weight-semibold)"
  },
  "duration": {
    "fast": "var(--sui-duration-fast)"
  },
  "easing": {
    "standard": "var(--sui-easing-standard)"
  }
};
export declare const palette: {
  "green": {
    "50": "#ebf9f0",
    "100": "#d6f4e1",
    "200": "#b3e8c8",
    "300": "#87d5a8",
    "400": "#57b884",
    "500": "#309564",
    "600": "#14764a",
    "700": "#085c38",
    "800": "#03472a",
    "900": "#03351e",
    "950": "#0b2f1d"
  },
  "gray": {
    "50": "#f8fbf9",
    "100": "#f0f6f2",
    "200": "#e0e6e2",
    "300": "#d0d6d2",
    "400": "#9ca19e",
    "500": "#6e7470",
    "600": "#505451",
    "700": "#3c413e",
    "800": "#242926",
    "900": "#151917",
    "950": "#080a09"
  },
  "red": {
    "50": "#fef2f1",
    "100": "#ffe2df",
    "200": "#ffcbc5",
    "300": "#ffa59d",
    "400": "#ff6761",
    "500": "#fb2c38",
    "600": "#e30025",
    "700": "#be021e",
    "800": "#9f0619",
    "900": "#82171b",
    "950": "#46080a"
  },
  "white": "#ffffff"
};
export type SemanticColor = keyof (typeof tokens)['color'];
export type Theme = 'system' | 'dark' | 'light';

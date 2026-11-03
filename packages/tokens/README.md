# @stop-ui/tokens

Design tokens for Stop UI, authored in the [W3C Design Tokens (DTCG)](https://www.designtokens.org/)
format and compiled to CSS custom properties, a Tailwind preset and typed JavaScript.

Tokens are the single source of truth for every visual decision in the kit. A rebrand or a new
color scheme is a change to a few JSON values, and the build verifies that every text and control
color still meets WCAG contrast before anything ships.

## Usage

### CSS custom properties

```css
@import '@stop-ui/tokens/tokens.css';

.card {
  background: var(--sui-surface);
  color: var(--sui-fg);
  border-radius: var(--sui-radius-md);
}
```

`@stop-ui/react/styles.css` already includes these variables.

### Themes

Set `data-sui-theme` to `light`, `dark` or `system` on any element. Themes can be nested.

### Tailwind preset

Use the same tokens in your application's own Tailwind markup. Utilities are namespaced under
`sui` so they never collide with your theme:

```css
@import 'tailwindcss';
@import '@stop-ui/tokens/tokens.css';
@import '@stop-ui/tokens/tailwind.css';
```

```html
<div class="bg-sui-surface text-sui-fg rounded-sui-md border border-sui-border">…</div>
```

### JavaScript

```ts
import { tokens, palette, type SemanticColor } from '@stop-ui/tokens';

tokens.color.primary; // 'var(--sui-primary)' — follows the active theme
palette.green['950']; // '#0b2f1d'
```

## Token tiers

| Tier       | Example                                      | Purpose                                                       |
| ---------- | -------------------------------------------- | ------------------------------------------------------------- |
| Primitives | `--sui-green-950`, `--sui-radius-md`         | Raw palette and scale.                                        |
| Semantic   | `--sui-primary`, `--sui-surface`, `--sui-fg` | Roles used by components; differ per theme.                   |
| Component  | `--sui-button-primary-bg`                    | Per-component overrides (coming with the Button color model). |

Customize at the highest tier that fits: override a semantic token to change every component, or a
component token to change one.

## Sizing

`--sui-rem` drives every size. All other `rem` tokens are emitted as
`calc(var(--sui-rem) * n)`, so a host that changes the root font size (Bootstrap 3 sets
`html { font-size: 10px }`) can restore the intended scale with `:root { --sui-rem: 16px; }`.

## Editing tokens

```
tokens/
├── primitives/color.json   palette (DTCG color objects)
├── primitives/scale.json   rem, spacing, radius, text, leading, font weight, motion
├── themes/light.json       semantic tokens referencing primitives
├── themes/dark.json
├── components/             component tier
├── $themes.json            which token sets make up each theme
└── $metadata.json          token set order
contrast.json               required contrast for each foreground/background pair
```

1. Edit the JSON (or let a design tool write it, see below).
2. Run `pnpm tokens` from the repository root (`pnpm dev` rebuilds automatically on change).
3. The build fails with a clear message if any pair in `contrast.json` drops below its minimum:

```
Contrast check failed:
  [dark] primary-fg on primary: 3.10:1 (needs 4.5:1) — Text on primary buttons (WCAG 1.4.3).
```

The build uses [Style Dictionary](https://styledictionary.com/) to read and resolve the DTCG
sources, then writes all outputs with custom formats.

## Design tool integration

The token folder follows the multi-file layout used by
[Tokens Studio for Figma](https://tokens.studio/): each JSON file is a token set, `$themes.json`
groups sets into themes and `$metadata.json` keeps their order. The build reads `$themes.json`
directly, so the same file drives Figma themes and the generated CSS. Syncing Figma with this folder
is planned as a separate feature.

## Outputs

| Export                               | Contents                                                |
| ------------------------------------ | ------------------------------------------------------- |
| `@stop-ui/tokens/tokens.css`         | Variables and themes (plain CSS, `theme` cascade layer) |
| `@stop-ui/tokens/tailwind.css`       | Tailwind preset for applications                        |
| `@stop-ui/tokens/tailwind-theme.css` | Tailwind theme used to build the kit                    |
| `@stop-ui/tokens`                    | `tokens`, `palette` and types                           |
| `@stop-ui/tokens/tokens/*`           | The DTCG source files                                   |

Part of [Stop UI](https://github.com/arthurkham/stop-ui-kit#readme). Licensed under MIT.

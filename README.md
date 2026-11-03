# Stop UI

Accessible, themeable React components built with Tailwind CSS.

> **Status:** early development. The API is not stable yet.

## Accessibility first

Accessibility is the core feature of this kit, not an afterthought.

- **WCAG 2.2 AA** is the minimum for every component; body text meets AAA contrast in both themes.
- **Full keyboard support.** Every interactive component follows the
  [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) keyboard model, and each
  component's documentation includes a keyboard reference.
- **Visible focus.** A clear focus indicator for keyboard users that also works in forced-colors
  (Windows High Contrast) mode.
- **Screen readers.** Correct roles, states and names; components are manually tested with
  VoiceOver.
- **Respects user preferences:** `prefers-reduced-motion`, `prefers-color-scheme`, forced colors and
  the browser's default font size.
- **Verified, not just claimed.** Automated axe checks and keyboard interaction tests run for every
  component.

## Packages

| Package                                | Description                                                          |
| -------------------------------------- | -------------------------------------------------------------------- |
| [`@stop-ui/react`](./packages/react)   | React components. Installs everything below automatically.           |
| [`@stop-ui/core`](./packages/core)     | Framework-agnostic behavior and accessibility primitives.            |
| [`@stop-ui/styles`](./packages/styles) | Style recipes and the compiled stylesheet, shared by all frameworks. |
| [`@stop-ui/tokens`](./packages/tokens) | Design tokens and themes as plain CSS custom properties.             |

Vue 3 support is planned (`@stop-ui/vue`), built on the same core, styles and tokens.

## Installation

```bash
pnpm add @stop-ui/react
```

Import the stylesheet once at the root of your application:

```ts
import '@stop-ui/react/styles.css';
```

## Usage

```tsx
import { Button } from '@stop-ui/react';

export function SaveButton() {
  return <Button onClick={save}>Save</Button>;
}
```

## Theming

Set `data-sui-theme` to `light`, `dark` or `system` on any element. Themes can be nested.

```html
<body data-sui-theme="system">
  …
</body>
```

Every color is a semantic CSS custom property (`--sui-primary`, `--sui-surface`, `--sui-fg`, …),
so a brand theme only needs to override a few variables.

## Using alongside other CSS

The kit is designed to live inside existing applications:

- No global reset is included, and utilities and tokens are prefixed (`sui:`, `--sui-*`).
- Kit styles live in the `components` cascade layer: above a host's `base` layer (e.g. Tailwind
  preflight) and below its `utilities` layer. Your own utilities and unlayered CSS always win, so
  `<Button className="px-8">` works regardless of import order.

### Legacy global CSS (Bootstrap 3, normalize.css)

Unlayered CSS always beats layered CSS, regardless of specificity. Global element styles such as
`button { color: inherit; font: inherit }` from normalize.css would therefore override the kit. Load
such stylesheets into a cascade layer below the kit, and declare the layer order before any other CSS:

```html
<style>
  @layer legacy, theme, base, components, utilities;
  @import url('/css/bootstrap.css') layer(legacy);
</style>
```

Your application's own unlayered CSS keeps overriding Bootstrap exactly as before.

Bootstrap 3 also sets `html { font-size: 10px }`. Restore the kit's intended scale with a single
variable:

```css
:root {
  --sui-rem: 16px;
}
```

See **Compatibility / Bootstrap 3** in Storybook for a side-by-side comparison.

## Browser support

Safari 16.4+, Chrome 111+, Firefox 128+.

## Development

```bash
pnpm install
pnpm dev          # Storybook on http://localhost:6006
pnpm test         # unit, keyboard and axe tests
pnpm check        # typecheck, lint, format, tests, build and package validation
pnpm build        # build all packages
pnpm changeset    # describe a change for the next release
```

The repository is a pnpm workspace: published packages live in `packages/`, Storybook in
`apps/storybook`, and shared test helpers in `tooling/`.

See the [roadmap](./ROADMAP.md) for what is planned next.

## License

[MIT](./LICENSE)

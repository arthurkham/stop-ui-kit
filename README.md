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

| Package                                | Description                                                                           |
| -------------------------------------- | ------------------------------------------------------------------------------------- |
| [`@stop-ui/react`](./packages/react)   | React components. Installs everything below automatically.                            |
| [`@stop-ui/core`](./packages/core)     | Framework-agnostic behavior and accessibility primitives.                             |
| [`@stop-ui/styles`](./packages/styles) | Style recipes and the compiled stylesheet, shared by all frameworks.                  |
| [`@stop-ui/tokens`](./packages/tokens) | Design tokens (W3C DTCG) compiled to CSS variables, a Tailwind preset and TypeScript. |

Vue 3 support is planned (`@stop-ui/vue`), built on the same core, styles and tokens.

## Design tokens as the single source of truth

Every color, size and radius comes from [W3C DTCG](https://www.designtokens.org/) design tokens.
The build turns them into CSS variables, a Tailwind preset for your own markup and typed
JavaScript, and **fails if any text or control color drops below WCAG contrast**. Rebranding or
adding a color scheme is a change to a few JSON values, not a hunt through component styles.
The token files follow the Tokens Studio layout, ready for Figma sync.
See [`@stop-ui/tokens`](./packages/tokens).

## Installation

```bash
pnpm add @stop-ui/react
```

Import the stylesheet once at the root of your application:

```ts
import '@stop-ui/react/styles.css';
```

That is all an existing site needs: the stylesheet adds no global styles, and the site's own CSS,
Bootstrap included, cannot break kit components. See [Stylesheets](#stylesheets) for the layered
alternative for new applications.

## Usage

```tsx
import { Button } from '@stop-ui/react';

<Button onClick={save}>Save</Button>
<Button variant="outline" tone="neutral">Cancel</Button>
<Button variant="soft" tone="danger">Delete</Button>
```

Shape (`variant`) and color (`tone`) are independent. Add your project's own tones, shapes and
defaults once with a factory, fully typed:

```tsx
// app/ui/button.tsx
import { createButton } from '@stop-ui/react';

export const Button = createButton({
  tones: {
    success: { color: 'var(--app-success)', hover: 'var(--app-success-hover)', fg: '#fff' },
  },
  variants: { pill: { extends: 'solid', className: 'rounded-full! px-6!' } },
});
```

See **Customization** in Storybook for changing colors without overriding styles, adding tones and
shapes, and styling hooks.

## Theming

Set `data-sui-theme` to `light`, `dark` or `system` on any element. Themes can be nested.

```html
<body data-sui-theme="system">
  …
</body>
```

Every color is a semantic CSS custom property (`--sui-primary`, `--sui-surface`, `--sui-fg`, …),
so a brand theme only needs to override a few variables. To use the same tokens in your own
Tailwind markup (`bg-sui-primary`, `rounded-sui-md`), add the
[Tailwind preset](./packages/tokens#tailwind-preset).

## Stylesheets

The kit ships one design in two stylesheets. Pick one and import it once.

| Stylesheet                        | For                                               | Your CSS overrides kit styles                    |
| --------------------------------- | ------------------------------------------------- | ------------------------------------------------ |
| `@stop-ui/react/styles.css`       | Any site, including existing ones with global CSS | With `!important` (Tailwind: `px-8!`)            |
| `@stop-ui/react/styles.layer.css` | New applications without legacy global CSS        | Always (`className="px-8"`), in any import order |

Both include no reset and no global selectors, and prefix every class and variable (`sui:`,
`--sui-*`), so adding the kit never changes the rest of the page. In both, tokens are the main way
to customize: CSS variables never compete with selectors, so colors, themes and component tokens
work the same way everywhere.

### `styles.css`: isolated (default)

Kit styles are protected from the page's CSS, so the kit can be added to an existing site without
touching its stylesheets:

- **Bootstrap 3, normalize.css and the site's own global styles** (`label { font-weight: bold }`,
  `#content input { … }`) do not affect kit components, whatever their load order.
- **Existing behavior keeps working.** `!important` rules and inline styles still apply to kit
  components, so Bootstrap's `.hidden` and `.pull-right` and jQuery's `.hide()` and `.show()` work
  as before.
- **To override a kit style yourself**, use tokens, `style`, or `!important`: Tailwind's important
  modifier (`className="rounded-full!"`) or `!important` in plain CSS. Classes for properties the
  kit does not set (width, margin, shadow) need nothing extra.

How it works: kit rules are not in a cascade layer and have the specificity of two ID selectors
(`:not(#\#):not(#\#)`, which matches every element), so host rules without `!important` cannot win
against them unless they use more than two IDs.

**Bootstrap 3** sets `html { font-size: 10px }`, which would make the kit smaller. Restore its scale
with a variable that only the kit reads:

```css
:root {
  --sui-rem: 16px;
}
```

The [consumer test](./docs/quality.md#consumer-test) checks all of this on every change, in a real
application next to untouched Bootstrap 3 and aggressive global CSS.

### `styles.layer.css`: layered

Kit styles live in the `components` cascade layer: above a host's `base` layer (e.g. Tailwind
preflight) and below its `utilities` layer. Your own utilities and unlayered CSS always win, so
`<Button className="px-8">` works without `!`, regardless of import order.

Because unlayered CSS always beats layered CSS, global CSS such as Bootstrap 3 would override this
stylesheet. Use it only when the page has no such CSS, or load that CSS into the `base` layer
(`@import 'bootstrap.css' layer(base);`), which changes how it interacts with your own styles.
If your application uses its own cascade layers, declare the order once, before any other CSS:

```css
@layer theme, base, components, app, utilities;
```

## Browser support

Safari 16.4+, Chrome 111+, Firefox 128+.

## Development

```bash
pnpm install
pnpm dev          # Storybook on http://localhost:6006
pnpm test         # unit, keyboard and axe tests
pnpm test:browser # stories in real browsers, light and dark themes
pnpm test:consumer # packed packages in a fresh application next to Tailwind and Bootstrap
pnpm check        # everything CI checks except browser and visual tests
pnpm build        # build all packages
pnpm changeset    # describe a change for the next release
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [docs/quality.md](./docs/quality.md).

The repository is a pnpm workspace: published packages live in `packages/`, Storybook in
`apps/storybook`, and shared test helpers in `tooling/`.

See the [roadmap](./ROADMAP.md) for what is planned next.

## License

[MIT](./LICENSE)

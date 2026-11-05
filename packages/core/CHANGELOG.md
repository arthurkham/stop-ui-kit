# @stop-ui/core

## 0.1.0

### Minor Changes

- 490f565: Button color model: shape (`variant`: solid, soft, outline, ghost) and color (`tone`: primary,
  neutral, danger) are now independent.

  **Breaking:** `variant="primary"` → default (`solid` + `primary`), `secondary` → `variant="soft" tone="neutral"`,
  `outline` → `variant="outline" tone="neutral"`, `ghost` → `variant="ghost" tone="neutral"`,
  `danger` → `tone="danger"`. Semantic tokens `secondary*` were replaced by `neutral*`, and
  `danger-text` was added.

  - Button component tokens (`--sui-button-<tone>`, `-hover`, `-fg`, `-text`) restyle buttons without
    overriding styles; the build checks every tone in every shape and theme for WCAG AA contrast.
  - `createButton` adds project tones, shapes (new or extending a built-in one) and defaults, fully
    typed, and warns in development about low-contrast tones.
  - Styling hooks: `data-sui-button`, `data-variant`, `data-tone`, `data-size`, `data-loading`.
  - `cn` no longer merges classes at runtime; `tailwind-merge` is no longer a dependency.
  - `@stop-ui/core` exports `contrastRatio` and `parseHexColor`.

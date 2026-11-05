# @stop-ui/styles

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

- 8224ebf: Generate design tokens from W3C DTCG sources. `@stop-ui/tokens` now ships CSS custom properties,
  a Tailwind preset for applications (`bg-sui-primary`, `rounded-sui-md`, …), typed JavaScript
  references and the DTCG source files. Every theme is checked against WCAG contrast rules at build
  time. The kit's Tailwind theme no longer relies on Tailwind defaults.
- 1ca4aa2: Form fields: `Field`, `Label`, `FieldDescription`, `FieldError`, `Input`, `InputGroup`,
  `InputGroupAddon`, `Textarea` and `NativeSelect`.

  - `Field` connects the label, description and error to the control: ids, `aria-describedby`,
    `aria-invalid`, and the required, disabled and read-only states. Custom controls join through
    `useFieldControl`.
  - Native elements throughout, so form submission, autofill and validation attributes work as usual.
    Errors are announced with the field, or through a polite live region with `FieldError live`.
  - Sizes match `Button` (32, 36 and 40px). `Textarea` can grow with its content (`autoResize`).
  - Form field component tokens (`--sui-input-bg`, `-border`, `-border-hover`, `-border-invalid`,
    `-placeholder`, `-bg-readonly`), with placeholder and border contrast checked at build time in
    every theme.
  - Styling hooks: `data-sui-field`, `data-sui-label`, `data-sui-input`, `data-sui-textarea`,
    `data-sui-select`, `data-sui-input-group`, `data-size`.
  - Component tokens can now be optional properties with semantic fallbacks, in addition to button tones.

- b7aea84: Two stylesheets: `styles.css` is now isolated, and the layered stylesheet moved to
  `styles.layer.css`.

  - **`styles.css` (default)** can be added to an existing site without changing its CSS. Kit styles
    are unlayered with the specificity of two ID selectors, so Bootstrap 3, normalize.css and a site's
    own global styles no longer affect kit components, in any load order. `!important` rules and
    inline styles still apply, so Bootstrap's `.hidden` and jQuery's `.hide()` keep working.
  - **`styles.layer.css`** keeps kit styles in the `components` cascade layer for applications without
    legacy global CSS, where plain classes override kit styles.

  **Breaking:** with `styles.css`, application classes and CSS that replace kit styles need
  `!important` (Tailwind: `px-8!`). Tokens work as before. To keep the previous behavior, import
  `styles.layer.css` instead.

  Buttons, inputs, selects and labels also set vertical padding, letter spacing and text transform
  explicitly, so host styles cannot change them.

### Patch Changes

- 64ea965: The focus indicator of buttons and form fields appears at full contrast at once instead of fading
  in from the text color.
- Updated dependencies [490f565]
- Updated dependencies [8224ebf]
- Updated dependencies [1ca4aa2]
  - @stop-ui/tokens@0.1.0

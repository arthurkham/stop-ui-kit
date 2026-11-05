---
'@stop-ui/styles': minor
'@stop-ui/react': minor
---

Two stylesheets: `styles.css` is now isolated, and the layered stylesheet moved to
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

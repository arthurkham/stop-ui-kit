---
'@stop-ui/tokens': minor
'@stop-ui/styles': minor
'@stop-ui/react': minor
---

Form fields: `Field`, `Label`, `FieldDescription`, `FieldError`, `Input`, `InputGroup`,
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

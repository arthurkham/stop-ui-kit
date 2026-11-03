---
'@stop-ui/tokens': minor
'@stop-ui/styles': minor
---

Generate design tokens from W3C DTCG sources. `@stop-ui/tokens` now ships CSS custom properties,
a Tailwind preset for applications (`bg-sui-primary`, `rounded-sui-md`, …), typed JavaScript
references and the DTCG source files. Every theme is checked against WCAG contrast rules at build
time. The kit's Tailwind theme no longer relies on Tailwind defaults.

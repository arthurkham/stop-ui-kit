# Roadmap

## v1.0

### Architecture

- [x] Monorepo: `@stop-ui/tokens`, `@stop-ui/core`, `@stop-ui/styles`, `@stop-ui/react`
- [x] One shared version for all packages (Changesets)
- [x] Design tokens in W3C DTCG format generating CSS, a Tailwind preset and TypeScript types
- [x] Contrast check of every theme at build time
- [ ] Figma sync (Tokens Studio)
- [x] Component tokens and `variant` × `tone` color model
- [x] `createButton` factory for project-level tones, shapes and defaults
- [ ] Factories for every colored component (`createBadge`, `createAlert`, …)
- [ ] Contract tests shared by all framework adapters

### Foundations

- [x] Design tokens with light, dark and system themes
- [x] Root scale variable (`--sui-rem`) for hosts that change the root font size
- [ ] Portal that carries the active theme into portaled content
- [ ] Focus management on `tabbable`, positioning on `@floating-ui/dom`
- [ ] `useControllableState` for controlled and uncontrolled state
- [ ] Positioning engine (flip, shift, scroll containers) for overlays

### Components

- [x] Button (solid, soft, outline, ghost × primary, neutral, danger)
- [ ] Label
- [ ] Input
- [ ] Textarea
- [ ] Checkbox
- [ ] Switch
- [ ] RadioGroup
- [ ] Dialog
- [ ] Popover
- [ ] Tooltip
- [ ] Tabs
- [ ] DropdownMenu
- [ ] Select

### Tooling and release

- [ ] CI: typecheck, lint, tests and package validation on React 18 and 19
- [ ] Storybook interaction and accessibility tests in a real browser
- [ ] Storybook published to GitHub Pages
- [ ] Versioning with Changesets and npm trusted publishing

## Accessibility testing

- [x] Automated axe checks and keyboard interaction tests for every component
- [ ] Manual screen reader testing with VoiceOver + Safari for every component
- [ ] Manual screen reader testing with NVDA + Firefox/Chrome on Windows
- [ ] Manual screen reader testing with JAWS
- [ ] Per-component screen reader support matrix in the documentation

## Vue

- [ ] `@stop-ui/vue` adapter, starting after Button, form inputs and Dialog ship in React

## After v1.0

- Combobox
- DatePicker
- Per-component entry points (`@stop-ui/react/dialog`)

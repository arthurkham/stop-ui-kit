# Contributing

## Setup

```bash
pnpm install
pnpm dev                          # tokens in watch mode + Storybook
pnpm exec playwright install      # once, for browser tests
```

## Workflow

1. Create a branch from `main`.
2. Make the change, with tests and stories.
3. If a published package changes, add a changeset: `pnpm changeset`.
4. Run `pnpm check` (and `pnpm test:browser` for UI changes).
5. Open a pull request. The title must follow [Conventional Commits](https://www.conventionalcommits.org/),
   for example `feat(button): add icon-only size`, because it becomes the commit message on `main`.

## Component guidelines

- **Accessibility first.** Prefer native elements and attributes (`<button>`, `<input>`, `required`,
  `disabled`) over ARIA. Every component has stories that run as axe and keyboard tests, and an
  Accessibility section in its documentation.
- **No hard-coded text.** Every visible or announced string is a prop with an English default
  (for example `loadingLabel="Loading"`), so applications can translate it.
- **Right-to-left ready.** Use logical properties only: `ps-*`, `pe-*`, `ms-*`, `me-*`, `start-*`,
  `end-*` and `text-start` instead of `pl-*`, `pr-*`, `ml-*`, `mr-*`, `left-*`, `right-*` and
  `text-left`. Recipe tests reject physical properties, and components with directional layout
  have a right-to-left story.
- **Colors come from tokens.** Components read semantic or component tokens, never fixed colors, so
  themes and rebranding work without overrides.
- **Styling hooks.** Render `data-sui-<component>` and the public state (`data-size`, `data-variant`,
  …) so the component can be styled from any CSS setup.

## Useful commands

| Command                                            | Description                                              |
| -------------------------------------------------- | -------------------------------------------------------- |
| `pnpm check`                                       | Everything CI checks, except browser and visual tests    |
| `pnpm test:browser`                                | Stories as tests in real browsers, light and dark themes |
| `BROWSERS=chromium THEMES=light pnpm test:browser` | A faster subset                                          |
| `pnpm css:update`                                  | Accept an intended change to the compiled CSS            |
| `pnpm size`                                        | Bundle size budgets                                      |
| `pnpm tokens`                                      | Rebuild design tokens                                    |

See [docs/quality.md](./docs/quality.md) for what each check protects.

## Releases

Merging to `main` updates a "chore: release packages" pull request with version bumps and
changelogs. Merging that pull request publishes all packages to npm from CI with provenance.

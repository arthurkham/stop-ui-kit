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

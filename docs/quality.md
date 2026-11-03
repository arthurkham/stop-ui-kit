# Quality checks

Stop UI makes promises to every application that installs it: components are accessible, the
stylesheet never restyles the host page, the API works on React 18 and 19, and updates do not
silently change how things look. Each check below protects one of those promises. All of them run
in CI on every pull request; most also run locally with `pnpm check`.

| Check                        | Command             | Protects against                                                         |
| ---------------------------- | ------------------- | ------------------------------------------------------------------------ |
| Type checking                | `pnpm typecheck`    | API and type regressions                                                 |
| Linting                      | `pnpm lint`         | Bugs, accessibility mistakes in JSX (`jsx-a11y`), kit classes in stories |
| Formatting                   | `pnpm format:check` | Noise in reviews                                                         |
| Unit, keyboard and axe tests | `pnpm test`         | Broken behavior, keyboard support and ARIA                               |
| React 18 / 19 matrix         | CI only             | Breaking the promised React 18 support                                   |
| Design token contrast        | `pnpm tokens`       | Unreadable colors after a rebrand                                        |
| Package validation           | `pnpm lint:package` | Broken `exports`, missing files, wrong types for consumers               |
| CSS invariants               | `pnpm check:css`    | Restyling the host page, class or variable collisions                    |
| CSS snapshot                 | `pnpm check:css`    | Silent output changes after Tailwind or token updates                    |
| Browser support              | `pnpm check:css`    | CSS features beyond the supported browsers                               |
| Bundle size budgets          | `pnpm size`         | Accidental bundle growth                                                 |
| Browser tests                | `pnpm test:browser` | Problems only real browsers show, in both themes                         |
| Visual tests                 | CI (Chromatic)      | Unintended visual changes                                                |
| Changeset                    | CI only             | Releasing changes without a changelog entry                              |
| Pull request title           | CI only             | Non-conventional commit messages on `main`                               |

## Why each check exists

### React 18 / 19 matrix

The kit supports both versions, and some code paths differ between them (for example, how
`asChild` reads a child's `ref`). Without running the tests on React 18, that support would only be
a claim. CI installs React 18 in a separate job and runs type checking and all unit tests.

### Design token contrast

Colors are data, so the token build checks every text and control color in every theme against WCAG
and fails with a readable report. This includes each button tone in every shape, using the same tint
math as the CSS. A rebrand cannot ship unreadable buttons.

### Package validation

`publint` and `@arethetypeswrong/cli` inspect the exact tarball that would be published (after
`publishConfig` and `workspace:` ranges are applied). They catch problems that only consumers would
see: an `exports` entry pointing to a missing file, or type declarations that do not resolve under
Node ESM.

### CSS invariants

The compiled stylesheet is parsed and checked for the guarantees the kit makes to host
applications:

- every class is prefixed (`sui:`), so it never collides with application classes;
- every utility lives in the `components` cascade layer, so application utilities always win;
- there are no global selectors (no reset of `button`, `a`, `body`…);
- only `--sui-*` and Tailwind-internal `--tw-*` custom properties are declared;
- the layer order is `theme`, `base`, `components`, `utilities`.

### CSS snapshot

`packages/styles/snapshots/styles.css` is a copy of the compiled stylesheet. Any change to the
generated CSS, for example after a Tailwind update, fails the check until the snapshot is updated
with `pnpm css:update` and committed. The diff makes the change visible in review instead of
discovering it in production.

### Browser support

Stylelint with `stylelint-no-unsupported-browser-features` checks the compiled CSS against the
`browserslist` in `package.json` (Safari 16.4+, Chrome 111+, Firefox 128+). It relies on Can I Use
data, so very new features may not be known to it; the browser tests in Firefox and WebKit cover the
rest.

### Bundle size budgets

`size-limit` measures what an application actually ships for a given import (tree-shaken, minified,
compressed, without React). Budgets are deliberately tight: raising one requires a reason in the pull
request.

### Browser tests

Every Storybook story runs as a test in Chromium, Firefox and WebKit, once in the light theme and once
in the dark theme. A story fails if it throws or if the accessibility checks (axe, including color
contrast) find a violation. Unit tests run in jsdom, which has no layout or styles; real browsers
catch issues such as an invisible focus ring or low contrast in one theme.

### Visual tests (Chromatic)

Chromatic captures every story in both themes and compares it with the accepted baseline. Changes are
reviewed and accepted in Chromatic's interface, which reports a separate status on the pull request.

Why Chromatic rather than self-hosted screenshot tests:

- **Made for Storybook.** It reuses the stories and theme modes we already have; no extra test code.
- **Review workflow.** Visual changes are approved or rejected per story in a UI, with diffs, and
  approved baselines follow branches and merges automatically.
- **Consistent rendering.** Snapshots are taken in a controlled cloud environment, so there are no
  false positives from fonts rendering differently on macOS and Linux, which is the main maintenance
  cost of self-hosted screenshot baselines.
- **Only what changed.** TurboSnap snapshots only the stories affected by a change, which keeps a
  free plan sufficient for a project of this size.

Trade-offs: it is an external service with usage limits. If that ever becomes a problem, the stories
and theme modes can be reused with Playwright `toHaveScreenshot` running in Docker.

### Changeset and pull request title

Releases are generated from changesets, and pull requests are squash-merged so their title becomes
the commit message on `main`. CI checks that changes to published packages include a changeset and
that titles follow Conventional Commits.

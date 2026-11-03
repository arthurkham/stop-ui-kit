import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState, type CSSProperties } from 'react';
import { Button } from './button.js';

const description = `
Triggers an action, such as saving a form or opening a dialog.

## Accessibility

- Renders a native \`<button>\` with \`type="button"\` by default, so it never submits a form by accident.
- **Loading** keeps the button focusable and sets \`aria-disabled\` and \`aria-busy\`. Activation is ignored
  (including implicit form submission with <kbd>Enter</kbd>), so keyboard and screen reader users never lose focus
  while an async action runs. Because \`aria-busy\` alone is rarely announced, the focused button also announces
  \`loadingLabel\` (default "Loading") through a polite live region. Announce the result (e.g. "Saved") in your app.
- **Disabled** uses the native \`disabled\` attribute and removes the button from the tab order. If users need to
  discover why an action is unavailable, explain it next to the button instead.
- The focus indicator is a 2px outline shown for keyboard focus only (\`:focus-visible\`). It stays visible in
  forced-colors (Windows High Contrast) mode, where each variant also keeps a visible border.
- Every variant meets WCAG 2.2 AA contrast in the light and dark themes.
- Animations respect \`prefers-reduced-motion\`.

### Keyboard

| Key | Action |
| --- | --- |
| <kbd>Tab</kbd> / <kbd>Shift</kbd> + <kbd>Tab</kbd> | Moves focus to or away from the button |
| <kbd>Enter</kbd> | Activates the button |
| <kbd>Space</kbd> | Activates the button |

## Rendering as a link

Navigation should use a link, not a button. Use \`asChild\` to give a link button styles while keeping
link semantics:

\`\`\`tsx
<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>
\`\`\`
`;

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
  },
  argTypes: {
    variant: {
      control: 'inline-radio',
      options: ['primary', 'secondary', 'outline', 'ghost', 'danger'],
    },
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
    asChild: {
      control: false,
    },
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

/*
 * Story layout uses inline styles on purpose: kit utility classes only exist in the package
 * stylesheet when a component uses them, so copying them from an example would silently fail.
 * Stories with a custom render function show a hand-written snippet of real usage instead.
 */
const row: CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 };

const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

export const Playground: Story = {};

export const Variants: Story = {
  parameters: source(`
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
`),
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="primary">
        Primary
      </Button>
      <Button {...args} variant="secondary">
        Secondary
      </Button>
      <Button {...args} variant="outline">
        Outline
      </Button>
      <Button {...args} variant="ghost">
        Ghost
      </Button>
      <Button {...args} variant="danger">
        Danger
      </Button>
    </div>
  ),
};

export const Sizes: Story = {
  parameters: source(`
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
`),
  render: (args) => (
    <div style={row}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

function LoadingDemo() {
  const [loading, setLoading] = useState(false);

  const save = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
      <Button loading={loading} loadingLabel="Saving" onClick={save}>
        {loading ? 'Saving…' : 'Save'}
      </Button>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--sui-fg-muted)' }}>
        Activate with the keyboard: focus stays on the button while it is loading.
      </p>
    </div>
  );
}

export const Loading: Story = {
  parameters: source(`
const [saving, setSaving] = useState(false);

async function save() {
  setSaving(true);
  try {
    await saveSettings();
  } finally {
    setSaving(false);
  }
}

<Button loading={saving} loadingLabel="Saving" onClick={save}>
  {saving ? 'Saving…' : 'Save'}
</Button>
`),
  render: () => <LoadingDemo />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AsLink: Story = {
  name: 'As link (asChild)',
  parameters: source(`
<Button asChild variant="outline">
  <a href="https://github.com">Open GitHub</a>
</Button>
`),
  render: () => (
    <Button asChild variant="outline">
      <a href="https://github.com">Open GitHub</a>
    </Button>
  ),
};

export const NestedThemes: Story = {
  parameters: source(`
<section data-sui-theme="light">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
</section>

<section data-sui-theme="dark">
  <Button>Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="outline">Outline</Button>
</section>
`),
  render: () => (
    <div style={{ ...row, alignItems: 'stretch', gap: 16 }}>
      {(['light', 'dark'] as const).map((theme) => (
        <section
          key={theme}
          data-sui-theme={theme}
          style={{
            ...row,
            padding: 16,
            borderRadius: 'var(--sui-radius-lg)',
            border: '1px solid var(--sui-border)',
            background: 'var(--sui-surface)',
          }}
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </section>
      ))}
    </div>
  ),
};

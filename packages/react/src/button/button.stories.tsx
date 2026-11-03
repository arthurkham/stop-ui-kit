import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div className="sui:flex sui:flex-wrap sui:items-center sui:gap-3">
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
  render: (args) => (
    <div className="sui:flex sui:flex-wrap sui:items-center sui:gap-3">
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
    <div className="sui:flex sui:flex-col sui:items-start sui:gap-3">
      <Button loading={loading} onClick={save}>
        {loading ? 'Saving…' : 'Save'}
      </Button>
      <p className="sui:m-0 sui:text-sm sui:text-fg-muted">
        Activate with the keyboard: focus stays on the button while it is loading.
      </p>
    </div>
  );
}

export const Loading: Story = {
  render: () => <LoadingDemo />,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const AsLink: Story = {
  name: 'As link (asChild)',
  render: () => (
    <Button asChild variant="outline">
      <a href="https://github.com">Open GitHub</a>
    </Button>
  ),
};

export const NestedThemes: Story = {
  render: () => (
    <div className="sui:flex sui:flex-wrap sui:gap-4">
      {(['light', 'dark'] as const).map((theme) => (
        <div
          key={theme}
          data-sui-theme={theme}
          className="sui:flex sui:flex-wrap sui:gap-3 sui:rounded-lg sui:border sui:border-solid sui:border-border sui:bg-surface sui:p-4"
        >
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      ))}
    </div>
  ),
};

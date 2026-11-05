import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState, type CSSProperties } from 'react';
import { Button } from '../button/button.js';
import { Field, FieldDescription } from '../field/field.js';
import { Input } from '../input/input.js';
import { Label } from '../label/label.js';
import { InputGroup, InputGroupAddon } from './input-group.js';

const description = `
Joins an \`Input\` with addons before or after it — a prefix, a unit, an icon or an inline button —
into what looks like one field. Hover, focus and invalid states follow the input, and the group takes
the input's place in a \`Field\`.

## Accessibility

- Addons are visual only: they are not part of the input's accessible name or description. Put meaningful
  units and prefixes into the label too (for example "Price, EUR"), or reference the addon with
  \`aria-describedby\`.
- Decorative icons need \`aria-hidden="true"\`.
- An inline button is a regular \`Button\` with its own accessible name. For a toggle, such as showing a
  password, use \`aria-pressed\` so screen readers announce its state, and keep its label stable.
- The focus indicator is drawn around the whole group while the input has focus; an inline button shows its
  own focus indicator.
`;

const meta = {
  title: 'Components/Forms/InputGroup',
  component: InputGroup,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'inline-radio',
      options: ['sm', 'md', 'lg'],
    },
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
} satisfies Meta<typeof InputGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack: CSSProperties = { display: 'grid', gap: 20, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

const SearchIcon = () => (
  <svg
    aria-hidden="true"
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
  >
    <circle cx="7" cy="7" r="4.5" />
    <path d="m10.5 10.5 3 3" strokeLinecap="round" />
  </svg>
);

export const Playground: Story = {
  parameters: source(`
<Field>
  <Label>Website</Label>
  <InputGroup>
    <InputGroupAddon>https://</InputGroupAddon>
    <Input type="text" inputMode="url" />
  </InputGroup>
</Field>
`),
  render: (args) => (
    <div style={stack}>
      <Field>
        <Label>Website</Label>
        <InputGroup {...args}>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input type="text" inputMode="url" />
        </InputGroup>
      </Field>
    </div>
  ),
};

export const Addons: Story = {
  parameters: source(`
<Field>
  <Label>Search</Label>
  <InputGroup>
    <InputGroupAddon><SearchIcon aria-hidden="true" /></InputGroupAddon>
    <Input type="search" />
  </InputGroup>
</Field>
<Field>
  <Label>Price, EUR</Label>
  <InputGroup>
    <Input inputMode="decimal" />
    <InputGroupAddon>EUR</InputGroupAddon>
  </InputGroup>
</Field>
`),
  render: () => (
    <div style={stack}>
      <Field>
        <Label>Search</Label>
        <InputGroup>
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <Input type="search" />
        </InputGroup>
      </Field>
      <Field>
        <Label>Price, EUR</Label>
        <InputGroup>
          <Input inputMode="decimal" />
          <InputGroupAddon>EUR</InputGroupAddon>
        </InputGroup>
      </Field>
      <Field invalid>
        <Label>Username</Label>
        <InputGroup>
          <InputGroupAddon>@</InputGroupAddon>
          <Input defaultValue="a" />
        </InputGroup>
      </Field>
    </div>
  ),
};

function PasswordField({ showLabel = 'Show password' }: { showLabel?: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <Field>
      <Label>Password</Label>
      <InputGroup>
        <Input type={visible ? 'text' : 'password'} autoComplete="current-password" />
        <InputGroupAddon>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            aria-pressed={visible}
            onClick={() => {
              setVisible(!visible);
            }}
          >
            {showLabel}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>At least 12 characters.</FieldDescription>
    </Field>
  );
}

export const PasswordToggle: Story = {
  name: 'Password toggle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText('Password');
    const toggle = canvas.getByRole('button', { name: 'Show password' });
    await expect(input).toHaveAttribute('type', 'password');

    await userEvent.click(toggle);
    await expect(input).toHaveAttribute('type', 'text');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  },
  parameters: source(`
function PasswordField({ showLabel = 'Show password' }) {
  const [visible, setVisible] = useState(false);

  return (
    <Field>
      <Label>Password</Label>
      <InputGroup>
        <Input type={visible ? 'text' : 'password'} autoComplete="current-password" />
        <InputGroupAddon>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            aria-pressed={visible}
            onClick={() => setVisible(!visible)}
          >
            {showLabel}
          </Button>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>At least 12 characters.</FieldDescription>
    </Field>
  );
}
`),
  render: () => (
    <div style={stack}>
      <PasswordField />
    </div>
  ),
};

export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    const groups = canvasElement.querySelectorAll('[data-sui-input-group]');
    const heights = Array.from(groups, (group) => getComputedStyle(group).height);
    await expect(heights).toEqual(['32px', '36px', '40px']);
  },
  parameters: source(`
<InputGroup size="sm">…</InputGroup>
<InputGroup size="md">…</InputGroup>
<InputGroup size="lg">…</InputGroup>
`),
  render: () => (
    <div style={stack}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <InputGroup key={size} size={size}>
          <InputGroupAddon>https://</InputGroupAddon>
          <Input aria-label={`Website, ${size}`} />
        </InputGroup>
      ))}
    </div>
  ),
};

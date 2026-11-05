import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Button } from '../button/button.js';
import { Field } from '../field/field.js';
import { Label } from '../label/label.js';
import { Input } from './input.js';

const description = `
A single-line text field. Renders a native \`<input>\`, so every native type, attribute and event
works (\`type\`, \`autoComplete\`, \`inputMode\`, \`pattern\`, form submission, browser autofill).

Use it inside a \`Field\` to connect a label, a description and an error message automatically.
To restyle inputs, see **Customization → Form fields**.

## Accessibility

- Always give the input a visible label (\`Label\` inside a \`Field\`). A placeholder is not a label: it
  disappears while typing and often has low contrast. If a visible label is not possible, use \`aria-label\`.
- Set \`autoComplete\` for personal data (\`email\`, \`name\`, \`tel\`, …) so browsers and password
  managers can fill it in (WCAG 1.3.5).
- Prefer the right \`type\` and \`inputMode\` (\`email\`, \`tel\`, \`url\`, \`decimal\`) to get the
  matching on-screen keyboard.
- The border meets 3:1 contrast against the background, and the placeholder meets 4.5:1, in the light
  and dark themes (checked at build time). The invalid state also changes the border color, never alone:
  pair it with a \`FieldError\` message.
- **Disabled** inputs are removed from the tab order and are not submitted. Use **read-only** for values
  users should see, select and copy, but not change: they stay focusable and are submitted.
- The focus indicator is a 2px outline shown for keyboard and pointer focus, and it stays visible in
  forced-colors (Windows High Contrast) mode.
- Sizes match \`Button\` (32, 36 and 40px), so inputs and buttons line up in a row.

## Styling hooks

Every input renders \`data-sui-input\` and \`data-size\`. States use native selectors and attributes:
\`:disabled\`, \`[readonly]\`, \`[aria-invalid="true"]\`.
`;

const meta = {
  title: 'Components/Forms/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Example',
    placeholder: 'Placeholder',
  },
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
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 12 };
const stack: CSSProperties = { display: 'grid', gap: 12, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

export const Playground: Story = {};

export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heights = ['Small', 'Medium', 'Large'].map(
      (name) => getComputedStyle(canvas.getByRole('textbox', { name })).height,
    );
    await expect(heights).toEqual(['32px', '36px', '40px']);
  },
  parameters: source(`
<Input size="sm" aria-label="Small" />
<Input size="md" aria-label="Medium" />
<Input size="lg" aria-label="Large" />
`),
  render: () => (
    <div style={stack}>
      <Input size="sm" aria-label="Small" placeholder="Small" />
      <Input size="md" aria-label="Medium" placeholder="Medium" />
      <Input size="lg" aria-label="Large" placeholder="Large" />
    </div>
  ),
};

export const States: Story = {
  parameters: source(`
<Input aria-label="Default" placeholder="name@example.com" />
<Input aria-label="Invalid" aria-invalid defaultValue="name@" />
<Input aria-label="Disabled" disabled defaultValue="Disabled" />
<Input aria-label="Read only" readOnly defaultValue="Read only" />
`),
  render: () => (
    <div style={stack}>
      <Input aria-label="Default" placeholder="name@example.com" />
      <Input aria-label="Invalid" aria-invalid defaultValue="name@" />
      <Input aria-label="Disabled" disabled defaultValue="Disabled" />
      <Input aria-label="Read only" readOnly defaultValue="Read only" />
    </div>
  ),
};

export const WithButton: Story = {
  name: 'With a button',
  play: async ({ canvasElement }) => {
    // Inputs and buttons of the same size line up.
    const canvas = within(canvasElement);
    const inputs = canvas.getAllByRole('searchbox');
    const buttons = canvas.getAllByRole('button');
    await expect(inputs).toHaveLength(3);
    for (const [index, input] of inputs.entries()) {
      await expect(input.getBoundingClientRect().height).toBe(
        buttons[index]?.getBoundingClientRect().height,
      );
    }
  },
  parameters: source(`
<form role="search">
  <Field>
    <Label>Search the docs</Label>
    <div className="search-row">
      <Input type="search" />
      <Button type="submit">Search</Button>
    </div>
  </Field>
</form>
`),
  render: () => (
    <div style={{ display: 'grid', gap: 20 }}>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Field key={size}>
          <Label>{`Search the docs (${size})`}</Label>
          <div style={row}>
            <Input size={size} type="search" />
            <Button size={size}>Search</Button>
          </div>
        </Field>
      ))}
    </div>
  ),
};

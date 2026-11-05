import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Field, FieldDescription } from '../field/field.js';
import { Label } from '../label/label.js';
import { NativeSelect } from './native-select.js';

const description = `
A dropdown built on the native \`<select>\`, styled to match \`Input\`. The browser and operating system
provide the list, so it is fully accessible, works with every input method and uses the native picker on
mobile devices. Use it for picking one value from a list; a custom \`Select\` with search and rich options
will be a separate component.

## Accessibility

- Give it a visible label through \`Field\` and \`Label\`.
- The chevron is decorative and hidden from assistive technology.
- For a required choice without a default, add a first empty option, such as
  \`<option value="" disabled>Select a plan</option>\`, together with \`required\`.
- Group long lists with \`<optgroup>\`.
- A native select cannot be read-only, so \`readOnly\` from a \`Field\` is not applied. Use \`disabled\`
  or show the value as text.

### Keyboard

Provided by the browser:

| Key | Action |
| --- | --- |
| <kbd>Tab</kbd> | Moves focus to or away from the select |
| <kbd>Space</kbd> / <kbd>Alt</kbd> + <kbd>↓</kbd> | Opens the list |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Moves to the previous or next option |
| Typing a letter | Moves to the next option starting with that letter |

## Styling hooks

The select renders \`data-sui-select\` and \`data-size\`; its wrapper renders \`data-sui-select-wrapper\`.
`;

const meta = {
  title: 'Components/Forms/NativeSelect',
  component: NativeSelect,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Country',
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
} satisfies Meta<typeof NativeSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack: CSSProperties = { display: 'grid', gap: 20, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

const countries = (
  <>
    <option value="pl">Poland</option>
    <option value="de">Germany</option>
    <option value="ua">Ukraine</option>
  </>
);

export const Playground: Story = {
  render: (args) => (
    <div style={stack}>
      <NativeSelect {...args}>{countries}</NativeSelect>
    </div>
  ),
};

export const InAField: Story = {
  name: 'In a field',
  parameters: source(`
<Field required>
  <Label>Plan</Label>
  <NativeSelect defaultValue="">
    <option value="" disabled>Select a plan</option>
    <optgroup label="Personal">
      <option value="free">Free</option>
      <option value="pro">Pro</option>
    </optgroup>
    <optgroup label="Business">
      <option value="team">Team</option>
      <option value="enterprise">Enterprise</option>
    </optgroup>
  </NativeSelect>
  <FieldDescription>You can change it at any time.</FieldDescription>
</Field>
`),
  render: () => (
    <div style={stack}>
      <Field required>
        <Label>Plan</Label>
        <NativeSelect defaultValue="">
          <option value="" disabled>
            Select a plan
          </option>
          <optgroup label="Personal">
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </optgroup>
          <optgroup label="Business">
            <option value="team">Team</option>
            <option value="enterprise">Enterprise</option>
          </optgroup>
        </NativeSelect>
        <FieldDescription>You can change it at any time.</FieldDescription>
      </Field>
    </div>
  ),
};

export const Sizes: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const heights = ['Small', 'Medium', 'Large'].map(
      (name) => getComputedStyle(canvas.getByRole('combobox', { name })).height,
    );
    await expect(heights).toEqual(['32px', '36px', '40px']);
  },
  parameters: source(`
<NativeSelect size="sm" aria-label="Small">…</NativeSelect>
<NativeSelect size="md" aria-label="Medium">…</NativeSelect>
<NativeSelect size="lg" aria-label="Large">…</NativeSelect>
`),
  render: () => (
    <div style={stack}>
      <NativeSelect size="sm" aria-label="Small">
        {countries}
      </NativeSelect>
      <NativeSelect size="md" aria-label="Medium">
        {countries}
      </NativeSelect>
      <NativeSelect size="lg" aria-label="Large">
        {countries}
      </NativeSelect>
    </div>
  ),
};

export const States: Story = {
  parameters: source(`
<NativeSelect aria-label="Invalid" aria-invalid>…</NativeSelect>
<NativeSelect aria-label="Disabled" disabled>…</NativeSelect>
`),
  render: () => (
    <div style={stack}>
      <NativeSelect aria-label="Invalid" aria-invalid>
        {countries}
      </NativeSelect>
      <NativeSelect aria-label="Disabled" disabled>
        {countries}
      </NativeSelect>
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field, FieldDescription, Input, Label, NativeSelect } from '@stop-ui/react';
import type { CSSProperties } from 'react';
import './customization.css';

const meta = {
  title: 'Customization/Form fields/Examples',
  // Rendered inside the customization docs pages only.
  tags: ['!dev', '!autodocs'],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const stack: CSSProperties = { display: 'grid', gap: 20, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

const Fields = () => (
  <>
    <Field>
      <Label>Email</Label>
      <Input type="email" placeholder="name@example.com" />
      <FieldDescription>We never share it.</FieldDescription>
    </Field>
    <Field>
      <Label>Country</Label>
      <NativeSelect>
        <option>Poland</option>
        <option>Germany</option>
      </NativeSelect>
    </Field>
  </>
);

export const ComponentTokens: Story = {
  parameters: source(`
<div className="settings">
  <Field>
    <Label>Email</Label>
    <Input type="email" placeholder="name@example.com" />
  </Field>
</div>
`),
  render: () => (
    <div className="demo-filled" style={stack}>
      <Fields />
    </div>
  ),
};

export const StylingHooks: Story = {
  parameters: source(`
<div className="profile">
  <Field>
    <Label>Email</Label>
    <Input type="email" placeholder="name@example.com" />
  </Field>
</div>
`),
  render: () => (
    <div className="demo-underlined" style={stack}>
      <Fields />
    </div>
  ),
};

import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import type { CSSProperties } from 'react';
import { Field, FieldDescription } from '../field/field.js';
import { Label } from '../label/label.js';
import { Textarea } from './textarea.js';

const description = `
A multi-line text field. Renders a native \`<textarea>\` with three rows by default. With
\`autoResize\`, it grows with its content instead of scrolling; set \`max-height\` (for example with
\`style\` or a class) to start scrolling after a limit.

## Accessibility

- Give it a visible label through \`Field\` and \`Label\`, like any other field.
- Without \`autoResize\`, users can resize it vertically. With \`autoResize\`, the height follows the content,
  so manual resizing is turned off.
- Contrast, invalid, disabled and read-only states and the focus indicator work as in \`Input\`.

## Styling hooks

Renders \`data-sui-textarea\` and \`data-size\`.
`;

const meta = {
  title: 'Components/Forms/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: {
    'aria-label': 'Example',
    placeholder: 'Write a message',
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
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack: CSSProperties = { display: 'grid', gap: 20, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

export const Playground: Story = {};

export const AutoResize: Story = {
  name: 'Auto resize',
  play: async ({ canvasElement }) => {
    const textarea = within(canvasElement).getByRole('textbox', { name: 'Message' });
    const initial = textarea.getBoundingClientRect().height;

    await userEvent.type(textarea, 'One{Enter}Two{Enter}Three{Enter}Four{Enter}Five{Enter}Six');
    const grown = textarea.getBoundingClientRect().height;
    await expect(grown).toBeGreaterThan(initial);
    // Content fits without scrolling.
    await expect(textarea.scrollHeight).toBeLessThanOrEqual(textarea.clientHeight + 1);
  },
  parameters: source(`
<Field>
  <Label>Message</Label>
  <Textarea autoResize style={{ maxHeight: 240 }} />
  <FieldDescription>Grows with its content up to 240px.</FieldDescription>
</Field>
`),
  render: () => (
    <div style={stack}>
      <Field>
        <Label>Message</Label>
        <Textarea autoResize style={{ maxHeight: 240 }} />
        <FieldDescription>Grows with its content up to 240px.</FieldDescription>
      </Field>
    </div>
  ),
};

export const States: Story = {
  parameters: source(`
<Textarea aria-label="Invalid" aria-invalid defaultValue="Too short" />
<Textarea aria-label="Disabled" disabled defaultValue="Disabled" />
<Textarea aria-label="Read only" readOnly defaultValue="Read only" />
`),
  render: () => (
    <div style={stack}>
      <Textarea aria-label="Invalid" aria-invalid defaultValue="Too short" />
      <Textarea aria-label="Disabled" disabled defaultValue="Disabled" />
      <Textarea aria-label="Read only" readOnly defaultValue="Read only" />
    </div>
  ),
};

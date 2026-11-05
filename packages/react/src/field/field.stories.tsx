import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { useState, type ComponentProps, type CSSProperties } from 'react';
import { Button } from '../button/button.js';
import { Input } from '../input/input.js';
import { Label } from '../label/label.js';
import { NativeSelect } from '../native-select/native-select.js';
import { Textarea } from '../textarea/textarea.js';
import { Field, FieldDescription, FieldError } from './field.js';

const description = `
Groups a label, a control, a description and an error message, and connects them for assistive
technology. Works with \`Input\`, \`Textarea\`, \`NativeSelect\` and your own controls
(through \`useFieldControl\`).

\`\`\`tsx
<Field invalid={!!error} required>
  <Label>Email</Label>
  <Input type="email" autoComplete="email" />
  <FieldDescription>We never share it.</FieldDescription>
  <FieldError>{error}</FieldError>
</Field>
\`\`\`

## What Field connects

| From the field | To the control |
| --- | --- |
| Generated \`id\` (or the \`id\` prop) | \`id\` of the control, \`htmlFor\` of the \`Label\` |
| Rendered \`FieldDescription\` and \`FieldError\` | \`aria-describedby\`, in that order |
| \`invalid\` | \`aria-invalid="true"\` |
| \`required\` | Native \`required\`, plus a visual marker in the \`Label\` |
| \`disabled\`, \`readOnly\` | Native \`disabled\`, \`readonly\` |

Props set on the control win, and an \`aria-describedby\` passed to the control is kept. Without a
\`Field\`, every control works on its own with manual wiring.

## Accessibility

- The label is a native \`<label>\`: clicking it focuses the control, and it is the control's accessible name.
- The description and the error are announced together with the label when the control receives focus.
  Empty \`FieldDescription\` and \`FieldError\` render nothing and are left out of \`aria-describedby\`.
- \`invalid\` sets \`aria-invalid\`, so screen readers announce the field as invalid. The error is never shown
  by color alone: the border changes and the message has an icon and text.
- Errors are not announced the moment they appear, which would interrupt typing. Validate on blur or submit
  and move focus to the first invalid field, or set \`live\` on \`FieldError\` to announce changes through a
  polite live region (it is rendered before the error so the change is announced).
- The required marker (\`*\`) is hidden from assistive technology; screen readers announce the native
  \`required\` state instead. Explain the marker once per form if your users may not know it.
- Text is passed by you, so it is never hard-coded and can be translated.
`;

const meta = {
  title: 'Components/Forms/Field',
  component: Field,
  tags: ['autodocs'],
  args: {
    invalid: false,
    required: false,
    disabled: false,
    readOnly: false,
  },
  parameters: {
    docs: {
      description: {
        component: description,
      },
    },
  },
} satisfies Meta<typeof Field>;

export default meta;

type Story = StoryObj<typeof meta>;

const stack: CSSProperties = { display: 'grid', gap: 20, maxWidth: 360 };
const source = (code: string) => ({ docs: { source: { code: code.trim(), language: 'tsx' } } });

export const Playground: Story = {
  parameters: source(`
<Field>
  <Label>Email</Label>
  <Input type="email" autoComplete="email" />
  <FieldDescription>We never share it.</FieldDescription>
  <FieldError>Enter an email address like name@example.com.</FieldError>
</Field>
`),
  render: (args) => (
    <div style={stack}>
      <Field {...args}>
        <Label>Email</Label>
        <Input type="email" autoComplete="email" />
        <FieldDescription>We never share it.</FieldDescription>
        <FieldError>
          {args.invalid ? 'Enter an email address like name@example.com.' : undefined}
        </FieldError>
      </Field>
    </div>
  ),
};

export const States: Story = {
  parameters: source(`
<Field required>
  <Label>Full name</Label>
  <Input autoComplete="name" />
</Field>
<Field invalid>
  <Label>Email</Label>
  <Input type="email" defaultValue="name@" />
  <FieldError>Enter an email address like name@example.com.</FieldError>
</Field>
<Field disabled>
  <Label>Company</Label>
  <Input defaultValue="Stop" />
  <FieldDescription>Managed by your organization.</FieldDescription>
</Field>
<Field readOnly>
  <Label>Account id</Label>
  <Input defaultValue="ACC-1024" />
</Field>
`),
  render: () => (
    <div style={stack}>
      <Field required>
        <Label>Full name</Label>
        <Input autoComplete="name" />
      </Field>
      <Field invalid>
        <Label>Email</Label>
        <Input type="email" defaultValue="name@" />
        <FieldError>Enter an email address like name@example.com.</FieldError>
      </Field>
      <Field disabled>
        <Label>Company</Label>
        <Input defaultValue="Stop" />
        <FieldDescription>Managed by your organization.</FieldDescription>
      </Field>
      <Field readOnly>
        <Label>Account id</Label>
        <Input defaultValue="ACC-1024" />
      </Field>
    </div>
  ),
};

function SignUpForm() {
  const [errors, setErrors] = useState<{ email?: string; plan?: string }>({});

  const onSubmit: ComponentProps<'form'>['onSubmit'] = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const next = {
      email: (data.get('email') as string).includes('@')
        ? undefined
        : 'Enter an email address like name@example.com.',
      plan: data.get('plan') ? undefined : 'Choose a plan.',
    };
    setErrors(next);
    // Move focus to the first invalid field, so its error is announced.
    const firstInvalid = next.email ? 'email' : next.plan ? 'plan' : undefined;
    if (firstInvalid) {
      form.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} style={stack}>
      <Field invalid={!!errors.email} required>
        <Label>Email</Label>
        <Input name="email" type="email" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </Field>
      <Field invalid={!!errors.plan} required>
        <Label>Plan</Label>
        <NativeSelect name="plan" defaultValue="">
          <option value="" disabled>
            Select a plan
          </option>
          <option value="free">Free</option>
          <option value="team">Team</option>
        </NativeSelect>
        <FieldError>{errors.plan}</FieldError>
      </Field>
      <Field>
        <Label>About your team</Label>
        <Textarea name="about" autoResize />
        <FieldDescription>Optional. Helps us set up your workspace.</FieldDescription>
      </Field>
      <div>
        <Button type="submit">Create account</Button>
      </div>
    </form>
  );
}

export const Validation: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));

    const email = canvas.getByRole('textbox', { name: 'Email' });
    await expect(email).toHaveFocus();
    await expect(email).toHaveAttribute('aria-invalid', 'true');
    await expect(email).toHaveAccessibleDescription(
      'Enter an email address like name@example.com.',
    );

    await userEvent.type(email, 'artur@example.com');
    await userEvent.click(canvas.getByRole('button', { name: 'Create account' }));
    await expect(canvas.getByRole('combobox', { name: 'Plan' })).toHaveFocus();
    await expect(email).not.toHaveAttribute('aria-invalid');
  },
  parameters: source(`
function SignUpForm() {
  const [errors, setErrors] = useState<{ email?: string; plan?: string }>({});

  return (
    <form noValidate onSubmit={validateAndFocusFirstInvalid}>
      <Field invalid={!!errors.email} required>
        <Label>Email</Label>
        <Input name="email" type="email" autoComplete="email" />
        <FieldError>{errors.email}</FieldError>
      </Field>
      <Field invalid={!!errors.plan} required>
        <Label>Plan</Label>
        <NativeSelect name="plan" defaultValue="">
          <option value="" disabled>Select a plan</option>
          <option value="free">Free</option>
          <option value="team">Team</option>
        </NativeSelect>
        <FieldError>{errors.plan}</FieldError>
      </Field>
      <Field>
        <Label>About your team</Label>
        <Textarea name="about" autoResize />
        <FieldDescription>Optional. Helps us set up your workspace.</FieldDescription>
      </Field>
      <Button type="submit">Create account</Button>
    </form>
  );
}
`),
  render: () => <SignUpForm />,
};

export const RightToLeft: Story = {
  name: 'Right to left',
  parameters: source(`
<div dir="rtl" lang="ar">
  <Field required>
    <Label>البريد الإلكتروني</Label>
    <Input type="email" />
    <FieldDescription>لن نشاركه أبدًا.</FieldDescription>
  </Field>
  <Field>
    <Label>البلد</Label>
    <NativeSelect>
      <option>مصر</option>
      <option>الأردن</option>
    </NativeSelect>
  </Field>
</div>
`),
  play: async ({ canvasElement }) => {
    // Logical properties: the select chevron sits at the inline end, which is on the left in RTL.
    const select = within(canvasElement).getByRole('combobox', { name: 'البلد' });
    const icon = select.parentElement?.querySelector('svg');
    await expect(icon).toBeTruthy();
    const selectBox = select.getBoundingClientRect();
    const iconBox = icon?.getBoundingClientRect();
    await expect((iconBox?.left ?? Infinity) - selectBox.left).toBeLessThan(selectBox.width / 2);
  },
  render: () => (
    <div dir="rtl" lang="ar" style={stack}>
      <Field required>
        <Label>البريد الإلكتروني</Label>
        <Input type="email" />
        <FieldDescription>لن نشاركه أبدًا.</FieldDescription>
      </Field>
      <Field>
        <Label>البلد</Label>
        <NativeSelect>
          <option>مصر</option>
          <option>الأردن</option>
        </NativeSelect>
      </Field>
    </div>
  ),
};

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { expectNoAxeViolations } from '@stop-ui/test-utils';
import { Input } from '../input/input.js';
import { Label } from '../label/label.js';
import { NativeSelect } from '../native-select/native-select.js';
import { Textarea } from '../textarea/textarea.js';
import { Field, FieldDescription, FieldError } from './field.js';
import { useFieldControl } from './field-context.js';

const describedBy = (element: HTMLElement) =>
  (element.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);

describe('Field', () => {
  it('connects the label to the control', async () => {
    const user = userEvent.setup();
    render(
      <Field>
        <Label>Email</Label>
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.tagName).toBe('INPUT');

    await user.click(screen.getByText('Email'));
    expect(input).toHaveFocus();
  });

  it('links the description and the error with aria-describedby', () => {
    render(
      <Field invalid>
        <Label>Email</Label>
        <Input />
        <FieldDescription>We never share it.</FieldDescription>
        <FieldError>Enter a valid email.</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input).toHaveAccessibleDescription('We never share it. Enter a valid email.');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  it('only references parts that are rendered', () => {
    render(
      <Field>
        <Label>Name</Label>
        <Input />
        <FieldError>{undefined}</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText('Name');
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('updates aria-describedby when the error appears and disappears', async () => {
    const user = userEvent.setup();
    function Form() {
      const [error, setError] = useState<string>();
      return (
        <>
          <Field invalid={!!error}>
            <Label>Name</Label>
            <Input />
            <FieldError>{error}</FieldError>
          </Field>
          <button
            type="button"
            onClick={() => {
              setError(error ? undefined : 'Required.');
            }}
          >
            Toggle
          </button>
        </>
      );
    }
    render(<Form />);
    const input = screen.getByLabelText('Name');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(input).toHaveAccessibleDescription('Required.');
    expect(input).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('button', { name: 'Toggle' }));
    expect(input).not.toHaveAttribute('aria-describedby');
    expect(input).not.toHaveAttribute('aria-invalid');
  });

  it('keeps aria-describedby passed to the control', () => {
    render(
      <>
        <p id="hint">External hint.</p>
        <Field>
          <Label>Code</Label>
          <Input aria-describedby="hint" />
          <FieldDescription>Six digits.</FieldDescription>
        </Field>
      </>,
    );
    const input = screen.getByLabelText('Code');
    expect(describedBy(input)[0]).toBe('hint');
    expect(input).toHaveAccessibleDescription('External hint. Six digits.');
  });

  it('marks required fields on the control and visually on the label', () => {
    render(
      <Field required>
        <Label>Name</Label>
        <Input />
      </Field>,
    );
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toBeRequired();
    // The asterisk is decorative: it is not part of the accessible name.
    expect(screen.getByText('*')).toHaveAttribute('aria-hidden', 'true');
  });

  it('passes disabled and read-only states to the control', () => {
    render(
      <>
        <Field disabled>
          <Label>Disabled</Label>
          <Input />
        </Field>
        <Field readOnly>
          <Label>Read only</Label>
          <Input defaultValue="Fixed" />
        </Field>
      </>,
    );
    expect(screen.getByLabelText('Disabled')).toBeDisabled();
    expect(screen.getByLabelText('Read only')).toHaveAttribute('readonly');
  });

  it('lets props on the control win over the field', () => {
    render(
      <Field disabled id="field-control">
        <Label>Name</Label>
        <Input disabled={false} />
      </Field>,
    );
    const input = screen.getByLabelText('Name');
    expect(input).toBeEnabled();
    expect(input).toHaveAttribute('id', 'field-control');
  });

  it('works with every control', () => {
    render(
      <>
        <Field>
          <Label>Bio</Label>
          <Textarea />
          <FieldDescription>Optional.</FieldDescription>
        </Field>
        <Field required>
          <Label>Country</Label>
          <NativeSelect>
            <option value="pl">Poland</option>
          </NativeSelect>
        </Field>
      </>,
    );
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAccessibleDescription('Optional.');
    const select = screen.getByRole('combobox', { name: 'Country' });
    expect(select).toBeRequired();
    expect(select).not.toHaveAttribute('readonly');
  });

  it('connects custom controls through useFieldControl', () => {
    function ColorInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
      return <input type="color" {...useFieldControl(props)} />;
    }
    render(
      <Field invalid>
        <Label>Brand color</Label>
        <ColorInput />
        <FieldError>Pick a darker color.</FieldError>
      </Field>,
    );
    const input = screen.getByLabelText('Brand color');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAccessibleDescription('Pick a darker color.');
  });

  it('can announce errors through a live region that exists before the error', () => {
    const { rerender } = render(
      <Field>
        <Label>Name</Label>
        <Input />
        <FieldError live>{undefined}</FieldError>
      </Field>,
    );
    const region = document.querySelector('[data-sui-field-error]');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByLabelText('Name')).not.toHaveAttribute('aria-describedby');

    rerender(
      <Field invalid>
        <Label>Name</Label>
        <Input />
        <FieldError live>Required.</FieldError>
      </Field>,
    );
    expect(screen.getByLabelText('Name')).toHaveAccessibleDescription('Required.');
  });

  it('has no axe violations in every state', async () => {
    const { container } = render(
      <form>
        <Field required>
          <Label>Email</Label>
          <Input type="email" />
          <FieldDescription>We never share it.</FieldDescription>
        </Field>
        <Field invalid>
          <Label>Password</Label>
          <Input type="password" />
          <FieldError>Too short.</FieldError>
        </Field>
        <Field disabled>
          <Label>Company</Label>
          <Input />
        </Field>
      </form>,
    );
    await expectNoAxeViolations(container);
  });
});

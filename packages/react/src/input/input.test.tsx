import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@stop-ui/test-utils';
import { InputGroup, InputGroupAddon } from '../input-group/input-group.js';
import { NativeSelect } from '../native-select/native-select.js';
import { Textarea } from '../textarea/textarea.js';
import { Input } from './input.js';

describe('Input', () => {
  it('renders a native input with styling hooks', () => {
    render(<Input aria-label="Name" size="lg" />);
    const input = screen.getByRole('textbox', { name: 'Name' });
    expect(input).toHaveAttribute('data-sui-input', '');
    expect(input).toHaveAttribute('data-size', 'lg');
  });

  it('forwards the ref and native props', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const onChange = vi.fn();
    render(<Input ref={ref} aria-label="Name" name="name" onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'Artur');
    expect(ref.current?.value).toBe('Artur');
    expect(ref.current?.name).toBe('name');
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('participates in native forms', () => {
    const { container } = render(
      <form>
        <Input aria-label="Name" name="name" defaultValue="Artur" />
      </form>,
    );
    const form = container.querySelector('form');
    expect(form && new FormData(form).get('name')).toBe('Artur');
  });
});

describe('InputGroup', () => {
  it('renders the input without its own frame and inherits the group size', () => {
    render(
      <InputGroup size="sm">
        <InputGroupAddon>https://</InputGroupAddon>
        <Input aria-label="Website" />
      </InputGroup>,
    );
    const input = screen.getByRole('textbox', { name: 'Website' });
    expect(input).toHaveAttribute('data-size', 'sm');
    expect(input.className).toContain('sui:border-0');
    expect(input.className).not.toContain('sui:border-(color:--sui-input--border)');
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <InputGroup>
        <InputGroupAddon>EUR</InputGroupAddon>
        <Input aria-label="Price, EUR" inputMode="decimal" />
      </InputGroup>,
    );
    await expectNoAxeViolations(container);
  });
});

describe('Textarea', () => {
  it('renders three rows by default', () => {
    render(<Textarea aria-label="Bio" />);
    expect(screen.getByRole('textbox', { name: 'Bio' })).toHaveAttribute('rows', '3');
  });

  it('grows with its content when autoResize is on', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Bio" autoResize />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Bio' });
    // jsdom has no layout: emulate a content height that follows the number of lines.
    Object.defineProperty(textarea, 'scrollHeight', {
      configurable: true,
      get: () => 20 * textarea.value.split('\n').length,
    });

    await user.type(textarea, 'one{Enter}two{Enter}three');
    expect(textarea.style.height).toBe('60px');
    expect(textarea).toHaveAttribute('data-sui-textarea', '');
  });

  it('does not touch the height without autoResize', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label="Bio" />);
    const textarea = screen.getByRole<HTMLTextAreaElement>('textbox', { name: 'Bio' });
    await user.type(textarea, 'text');
    expect(textarea.style.height).toBe('');
  });
});

describe('NativeSelect', () => {
  it('renders a native select with options and a decorative icon', async () => {
    const user = userEvent.setup();
    render(
      <NativeSelect aria-label="Country" defaultValue="pl">
        <option value="pl">Poland</option>
        <option value="de">Germany</option>
      </NativeSelect>,
    );
    const select = screen.getByRole<HTMLSelectElement>('combobox', { name: 'Country' });
    expect(select.value).toBe('pl');

    await user.selectOptions(select, 'de');
    expect(select.value).toBe('de');
    expect(
      document.querySelector('[data-sui-select-wrapper] [aria-hidden="true"] svg'),
    ).not.toBeNull();
  });

  it('has no axe violations', async () => {
    const { container } = render(
      <NativeSelect aria-label="Country">
        <option value="pl">Poland</option>
      </NativeSelect>,
    );
    await expectNoAxeViolations(container);
  });
});

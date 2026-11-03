import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@stop-ui/test-utils';
import { Button } from './button.js';
import { createButton } from './create-button.js';

const AppButton = createButton({
  tones: {
    success: { color: '#15803d', hover: '#166534', fg: '#ffffff' },
    brand: { color: '#6d28d9', hover: '#5b21b6', fg: '#ffffff', text: '#5b21b6' },
  },
  variants: {
    pill: 'app-pill',
    rounded: { extends: 'solid', className: 'app-rounded' },
  },
  defaults: { size: 'sm' },
});

describe('createButton', () => {
  it('styles a custom tone through tone variables', () => {
    render(<AppButton tone="success">Confirm</AppButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-tone', 'success');
    expect(button.style.getPropertyValue('--sui-tone')).toBe('#15803d');
    expect(button.style.getPropertyValue('--sui-tone-hover')).toBe('#166534');
    expect(button.style.getPropertyValue('--sui-tone-fg')).toBe('#ffffff');
    expect(button.style.getPropertyValue('--sui-tone-text')).toBe('#15803d');
  });

  it('uses a separate text color when one is provided', () => {
    render(<AppButton tone="brand">Upgrade</AppButton>);
    expect(screen.getByRole('button').style.getPropertyValue('--sui-tone-text')).toBe('#5b21b6');
  });

  it('keeps built-in tones on tokens', () => {
    render(<AppButton tone="danger">Delete</AppButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-tone', 'danger');
    expect(button.style.getPropertyValue('--sui-tone')).toBe('');
  });

  it('applies a custom shape without built-in shape classes', () => {
    render(<AppButton variant="pill">Pill</AppButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'pill');
    expect(button).toHaveClass('app-pill');
    expect(button.className).not.toMatch(/bg-\(color:--sui-tone\)/);
  });

  it('extends a built-in shape', () => {
    render(<AppButton variant="rounded">Rounded</AppButton>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'rounded');
    expect(button).toHaveClass('app-rounded');
    expect(button.className).toContain('sui:bg-(color:--sui-tone)');
    expect(button).not.toHaveAttribute('basevariant');
  });

  it('combines custom tones with built-in shapes', () => {
    render(
      <AppButton tone="success" variant="outline">
        Confirm
      </AppButton>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'outline');
    expect(button.className).toContain('sui:border-(color:--sui-tone-border)');
  });

  it('applies defaults and lets props override them', () => {
    render(
      <>
        <AppButton>Default</AppButton>
        <AppButton size="lg">Large</AppButton>
      </>,
    );
    expect(screen.getByRole('button', { name: 'Default' })).toHaveAttribute('data-size', 'sm');
    expect(screen.getByRole('button', { name: 'Large' })).toHaveAttribute('data-size', 'lg');
  });

  it('merges tone variables with a custom style', () => {
    render(
      <AppButton tone="success" style={{ minWidth: 120 }}>
        Confirm
      </AppButton>,
    );
    const button = screen.getByRole('button');
    expect(button.style.minWidth).toBe('120px');
    expect(button.style.getPropertyValue('--sui-tone')).toBe('#15803d');
  });

  it('warns about custom tones below WCAG AA contrast', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    createButton({ tones: { faint: { color: '#a3e635', hover: '#84cc16', fg: '#ffffff' } } });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('tone "faint" fg on color'));
  });

  it('does not warn about accessible tones or values it cannot evaluate', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    createButton({
      tones: {
        success: { color: '#15803d', hover: '#166534', fg: '#ffffff' },
        brand: { color: 'var(--brand)', hover: 'var(--brand-dark)', fg: 'white' },
      },
    });
    expect(warn).not.toHaveBeenCalled();
  });

  it('has no axe violations for custom tones and shapes', async () => {
    const { container } = render(
      <>
        <AppButton tone="success">Confirm</AppButton>
        <AppButton tone="brand" variant="pill">
          Upgrade
        </AppButton>
      </>,
    );
    await expectNoAxeViolations(container);
  });

  it('keeps the built-in Button limited to built-in tones and shapes', () => {
    // @ts-expect-error -- custom tones are only available on created buttons
    render(<Button tone="success">Typed</Button>);
    // @ts-expect-error -- custom shapes are only available on created buttons
    render(<Button variant="pill">Typed</Button>);
    expect(screen.getAllByRole('button')).toHaveLength(2);
  });
});

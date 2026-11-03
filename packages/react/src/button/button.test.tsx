import { render, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef, useState, type SyntheticEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { expectNoAxeViolations } from '@stop-ui/test-utils';
import { Button } from './button.js';

describe('Button', () => {
  it('renders a native button that does not submit forms by default', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('respects an explicit type', () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole('button', { name: 'Send' })).toHaveAttribute('type', 'submit');
  });

  it('forwards the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Save</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it('renders styling hooks for plain CSS', () => {
    render(
      <Button variant="soft" tone="danger" size="lg" loading>
        Delete
      </Button>,
    );
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-sui-button', '');
    expect(button).toHaveAttribute('data-variant', 'soft');
    expect(button).toHaveAttribute('data-tone', 'danger');
    expect(button).toHaveAttribute('data-size', 'lg');
    expect(button).toHaveAttribute('data-loading', '');
  });

  it('defaults to a solid primary medium button', () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-variant', 'solid');
    expect(button).toHaveAttribute('data-tone', 'primary');
    expect(button).toHaveAttribute('data-size', 'md');
    expect(button).not.toHaveAttribute('data-loading');
  });

  it('keeps custom class names next to kit classes', () => {
    render(<Button className="sui:px-8 custom">Save</Button>);
    const button = screen.getByRole('button');
    // Both stay: application styles win through cascade layers, not by removing classes.
    expect(button).toHaveClass('sui:px-8', 'custom', 'sui:px-4');
  });

  describe('keyboard', () => {
    it('is reachable with Tab and activates with Enter and Space', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(<Button onClick={onClick}>Save</Button>);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();

      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      expect(onClick).toHaveBeenCalledTimes(2);
    });

    it('skips a disabled button in the tab order', async () => {
      const user = userEvent.setup();
      render(
        <>
          <Button disabled>Disabled</Button>
          <Button>Enabled</Button>
        </>,
      );

      await user.tab();
      expect(screen.getByRole('button', { name: 'Enabled' })).toHaveFocus();
    });
  });

  describe('loading', () => {
    it('stays focusable and announces its state', async () => {
      const user = userEvent.setup();
      render(<Button loading>Save</Button>);
      const button = screen.getByRole('button', { name: 'Save' });

      await user.tab();
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toBeEnabled();
    });

    it('ignores clicks and keyboard activation', async () => {
      const user = userEvent.setup();
      const onClick = vi.fn();
      render(
        <Button loading onClick={onClick}>
          Save
        </Button>,
      );

      await user.click(screen.getByRole('button'));
      await user.tab();
      await user.keyboard('{Enter}');
      expect(onClick).not.toHaveBeenCalled();
    });

    it('blocks form submission, including implicit submission with Enter', async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn((event: SyntheticEvent) => {
        event.preventDefault();
      });
      render(
        <form onSubmit={onSubmit}>
          <label>
            Name <input />
          </label>
          <Button type="submit" loading>
            Send
          </Button>
        </form>,
      );

      await user.click(screen.getByRole('button'));
      await user.type(screen.getByRole('textbox'), 'Artur{Enter}');
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('announces the loading state when the focused button starts loading', async () => {
      const user = userEvent.setup();

      function SaveButton() {
        const [loading, setLoading] = useState(false);
        return (
          <Button
            loading={loading}
            loadingLabel="Saving"
            onClick={() => {
              setLoading(true);
            }}
          >
            Save
          </Button>
        );
      }

      render(<SaveButton />);
      await user.tab();
      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(document.querySelector('[data-sui-live-announcer]')).toHaveTextContent('Saving');
      });
    });

    it('does not announce when the loading button is not focused', async () => {
      const region = document.querySelector('[data-sui-live-announcer]');
      if (region) region.textContent = '';

      render(
        <Button loading loadingLabel="Background work">
          Sync
        </Button>,
      );

      await new Promise((resolve) => setTimeout(resolve, 150));
      expect(document.querySelector('[data-sui-live-announcer]')?.textContent ?? '').toBe('');
    });

    it('does not set busy attributes when idle', () => {
      render(<Button>Save</Button>);
      const button = screen.getByRole('button');
      expect(button).not.toHaveAttribute('aria-disabled');
      expect(button).not.toHaveAttribute('aria-busy');
    });
  });

  describe('asChild', () => {
    it('renders the child element with button styles and keeps its semantics', () => {
      render(
        <Button asChild variant="outline">
          <a href="/docs">Docs</a>
        </Button>,
      );
      const link = screen.getByRole('link', { name: 'Docs' });
      expect(link).toHaveAttribute('href', '/docs');
      expect(link).not.toHaveAttribute('type');
      expect(link).toHaveAttribute('data-variant', 'outline');
      expect(link).toHaveAttribute('data-sui-button', '');
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it.each(
      (['solid', 'soft', 'outline', 'ghost'] as const).flatMap((variant) =>
        (['primary', 'neutral', 'danger'] as const).map((tone) => [variant, tone] as const),
      ),
    )('has no axe violations for %s / %s', async (variant, tone) => {
      const { container } = render(
        <Button variant={variant} tone={tone}>
          Save
        </Button>,
      );
      await expectNoAxeViolations(container);
    });

    it('has no axe violations while loading or disabled', async () => {
      const { container } = render(
        <>
          <Button loading>Saving</Button>
          <Button disabled>Save</Button>
        </>,
      );
      await expectNoAxeViolations(container);
    });
  });
});

import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Slot } from './slot.js';

describe('Slot', () => {
  it('renders the child element with merged props', () => {
    render(
      <Slot className="sui:px-2 from-slot" data-state="open" title="slot">
        <a href="/x" className="sui:px-4 from-child" title="child">
          Link
        </a>
      </Slot>,
    );
    const link = screen.getByRole('link');
    expect(link).toHaveClass('from-slot', 'from-child', 'sui:px-4');
    expect(link).not.toHaveClass('sui:px-2');
    expect(link).toHaveAttribute('data-state', 'open');
    expect(link).toHaveAttribute('title', 'child');
  });

  it('merges styles with the child taking precedence', () => {
    render(
      <Slot style={{ color: 'red', margin: '1px' }}>
        <span style={{ color: 'blue' }}>Text</span>
      </Slot>,
    );
    const element = screen.getByText('Text');
    expect(element.style.color).toBe('blue');
    expect(element.style.margin).toBe('1px');
  });

  it('composes the forwarded ref with the child ref', () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLButtonElement>();
    render(
      <Slot ref={slotRef}>
        <button ref={childRef} type="button">
          Go
        </button>
      </Slot>,
    );
    const button = screen.getByRole('button');
    expect(slotRef.current).toBe(button);
    expect(childRef.current).toBe(button);
  });

  it('calls the child handler first, then the slot handler', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <Slot onClick={() => calls.push('slot')}>
        <button type="button" onClick={() => calls.push('child')}>
          Go
        </button>
      </Slot>,
    );
    await user.click(screen.getByRole('button'));
    expect(calls).toEqual(['child', 'slot']);
  });

  it('skips the slot handler when the child prevents default', async () => {
    const user = userEvent.setup();
    const onSlotClick = vi.fn();
    render(
      <Slot onClick={onSlotClick}>
        <button
          type="button"
          onClick={(event) => {
            event.preventDefault();
          }}
        >
          Go
        </button>
      </Slot>,
    );
    await user.click(screen.getByRole('button'));
    expect(onSlotClick).not.toHaveBeenCalled();
  });

  it('throws when the child is not a single element', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Slot>text</Slot>)).toThrow();
  });
});

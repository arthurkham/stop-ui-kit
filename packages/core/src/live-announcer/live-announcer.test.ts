import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { announce } from './live-announcer.js';

const getRegion = () => document.querySelector<HTMLElement>('[data-sui-live-announcer]');

describe('announce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('creates a single polite status region and fills it after a short delay', () => {
    announce('Loading');
    const region = getRegion();

    expect(region).toHaveAttribute('role', 'status');
    expect(region).toHaveAttribute('aria-live', 'polite');
    expect(region).toBeEmptyDOMElement();

    vi.advanceTimersByTime(100);
    expect(region).toHaveTextContent('Loading');

    announce('Saving');
    vi.advanceTimersByTime(100);
    expect(document.querySelectorAll('[data-sui-live-announcer]')).toHaveLength(1);
    expect(region).toHaveTextContent('Saving');
  });

  it('clears the previous message so a repeated message is announced again', () => {
    announce('Loading');
    vi.advanceTimersByTime(100);

    announce('Loading');
    expect(getRegion()).toBeEmptyDOMElement();
    vi.advanceTimersByTime(100);
    expect(getRegion()).toHaveTextContent('Loading');
  });
});
